import dotenv from "dotenv";
import path from "path";
// Load server/.env into process.env (additive; never overrides existing vars).
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import Razorpay from "razorpay";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import { getUploadDir } from "./upload-paths";
import { getRazorpayConfig } from "./razorpay-config";
import { sendContactEmail, sendOrderNotification, sendCustomerConfirmation, isMailConfigured } from "./mailer";

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;
const uploadDir = getUploadDir();

let razorpay: Razorpay | null = null;

function getRazorpayClient() {
  if (!razorpay) {
    razorpay = new Razorpay(getRazorpayConfig(process.env));
  }
  return razorpay;
}

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
// Transparent WebP middleware — serves existing JPG/PNG uploads as WebP to browsers that support it
const webpCacheDir = path.join(uploadDir, "__webp");
if (!fs.existsSync(webpCacheDir)) fs.mkdirSync(webpCacheDir, { recursive: true });

app.get("/uploads/:filename", async (req, res, next) => {
  const filename = req.params.filename;
  const acceptsWebP = (req.headers.accept || "").includes("image/webp");
  const ext = path.extname(filename).toLowerCase();
  const isImage = [".jpg", ".jpeg", ".png"].includes(ext);

  if (!acceptsWebP || !isImage) return next();

  const baseName = filename.replace(/\.[^.]+$/, "");
  const cachedWebP = path.join(webpCacheDir, baseName + ".webp");

  try {
    if (!fs.existsSync(cachedWebP)) {
      const originalPath = path.join(uploadDir, filename);
      if (!fs.existsSync(originalPath)) return next();
      await sharp(originalPath)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(cachedWebP);
    }
    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.sendFile(cachedWebP);
  } catch {
    next();
  }
});

app.use("/uploads", express.static(uploadDir));

// Multer Setup for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB for high-quality videos
});

// --- SITEMAP & ROBOTS ---
app.get("/sitemap.xml", async (req, res) => {
  const base = "https://danywens.com";
  const staticUrls = [
    { loc: base, priority: "1.0", changefreq: "weekly" },
    { loc: `${base}/shop`, priority: "0.9", changefreq: "daily" },
    { loc: `${base}/collections`, priority: "0.8", changefreq: "weekly" },
    { loc: `${base}/lookbook`, priority: "0.7", changefreq: "monthly" },
    { loc: `${base}/about`, priority: "0.6", changefreq: "monthly" },
    { loc: `${base}/contact`, priority: "0.6", changefreq: "monthly" },
    { loc: `${base}/faq`, priority: "0.5", changefreq: "monthly" },
    { loc: `${base}/shipping`, priority: "0.4", changefreq: "monthly" },
    { loc: `${base}/returns`, priority: "0.4", changefreq: "monthly" },
    { loc: `${base}/privacy`, priority: "0.3", changefreq: "yearly" },
    { loc: `${base}/terms`, priority: "0.3", changefreq: "yearly" },
  ];

  const products = await prisma.product.findMany({ select: { slug: true } });
  const productUrls = products
    .filter((p: any) => p.slug)
    .map((p: any) => ({ loc: `${base}/product/${p.slug}`, priority: "0.8", changefreq: "weekly" }));

  const allUrls = [...staticUrls, ...productUrls];
  const today = new Date().toISOString().split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  res.set("Content-Type", "application/xml");
  res.send(xml);
});

app.get("/robots.txt", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /checkout\nDisallow: /account\nDisallow: /login\nDisallow: /signup\nDisallow: /track-order\nSitemap: https://danywens.com/sitemap.xml\n`
  );
});

// API Routes

// --- PRODUCTS ---
app.get("/api/products", async (req, res) => {
  const products = await prisma.product.findMany({ include: { colors: true } });
  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { colors: true }
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

app.post("/api/products", async (req, res) => {
  const { name, slug, price, category, productType, description, sizes, details, isNew, soldOut, soldOutSizes, colors, collectionId, shippingText, washcareText } = req.body;
  const colorsWithImages = (colors || []).map((c: any) => ({
    name: c.name,
    hex: c.hex,
    image: c.image,
    images: c.images ? JSON.stringify(c.images) : null,
    soldOut: c.soldOut || false,
    soldOutSizes: c.soldOutSizes ? JSON.stringify(c.soldOutSizes) : null,
    sizeStock: c.sizeStock ? JSON.stringify(c.sizeStock) : null,
  }));
  const product = await prisma.product.create({
    data: {
      name, slug, price, category, productType: productType || null, description,
      sizes: JSON.stringify(sizes),
      details: JSON.stringify(details),
      isNew: isNew || false,
      soldOut: soldOut || false,
      soldOutSizes: soldOutSizes ? JSON.stringify(soldOutSizes) : null,
      collectionId: collectionId || null,
      shippingText: shippingText?.trim() || null,
      washcareText: washcareText?.trim() || null,
      colors: { create: colorsWithImages }
    },
    include: { colors: true }
  });
  res.json(product);
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, slug, price, category, productType, description, sizes, details, isNew, soldOut, soldOutSizes, colors, collectionId, shippingText, washcareText } = req.body;

  await prisma.color.deleteMany({ where: { productId: id } });

  const colorsWithImages = (colors || []).map((c: any) => ({
    name: c.name,
    hex: c.hex,
    image: c.image,
    images: c.images ? JSON.stringify(c.images) : null,
    soldOut: c.soldOut || false,
    soldOutSizes: c.soldOutSizes ? JSON.stringify(c.soldOutSizes) : null,
    sizeStock: c.sizeStock ? JSON.stringify(c.sizeStock) : null,
  }));

  const product = await prisma.product.update({
    where: { id },
    data: {
      name, slug, price, category, productType: productType || null, description,
      sizes: JSON.stringify(sizes),
      details: JSON.stringify(details),
      isNew: isNew || false,
      soldOut: soldOut || false,
      soldOutSizes: soldOutSizes ? JSON.stringify(soldOutSizes) : null,
      collectionId: collectionId || null,
      shippingText: shippingText?.trim() || null,
      washcareText: washcareText?.trim() || null,
      colors: { create: colorsWithImages }
    },
    include: { colors: true }
  });
  res.json(product);
});

app.delete("/api/products/:id", async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.sendStatus(204);
});

// --- COLLECTIONS ---
app.get("/api/collections", async (req, res) => {
  const collections = await prisma.collection.findMany({
    include: { _count: { select: { products: true } } }
  });
  const mapped = collections.map(({ _count, ...c }) => ({
    ...c,
    productCount: _count.products,
  }));
  res.json(mapped);
});

app.post("/api/collections", async (req, res) => {
  const collection = await prisma.collection.create({ data: req.body });
  res.json(collection);
});

app.put("/api/collections/:id", async (req, res) => {
  const collection = await prisma.collection.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(collection);
});

app.delete("/api/collections/:id", async (req, res) => {
  await prisma.collection.delete({ where: { id: req.params.id } });
  res.sendStatus(204);
});

// --- MOSAIC ---
app.get("/api/mosaic", async (req, res) => {
  const tiles = await prisma.mosaicTile.findMany({ orderBy: { order: "asc" } });
  res.json(tiles);
});

app.post("/api/mosaic", async (req, res) => {
  try {
    const maxOrder = await prisma.mosaicTile.aggregate({ _max: { order: true } });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;
    const tile = await prisma.mosaicTile.create({ data: { ...req.body, order: nextOrder } });
    res.json(tile);
  } catch (error) {
    res.status(500).json({ error: "Failed to create tile" });
  }
});

app.put("/api/mosaic/:id", async (req, res) => {
  const tile = await prisma.mosaicTile.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(tile);
});

app.delete("/api/mosaic/:id", async (req, res) => {
  try {
    await prisma.mosaicTile.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete tile" });
  }
});

// --- SETTINGS ---
app.get("/api/settings", async (req, res) => {
  const settings = await prisma.setting.findMany();
  const settingsMap = settings.reduce((acc: any, s) => {
    try {
      acc[s.key] = JSON.parse(s.value);
    } catch {
      acc[s.key] = s.value;
    }
    return acc;
  }, {});
  res.json(settingsMap);
});

app.put("/api/settings", async (req, res) => {
  const updates = req.body;
  for (const [key, value] of Object.entries(updates)) {
    const stringValue = JSON.stringify(value);
    await prisma.setting.upsert({
      where: { key },
      update: { value: stringValue },
      create: { key, value: stringValue }
    });
  }
  res.json({ success: true });
});

// --- ANALYTICS ---
app.get("/api/analytics", async (req, res) => {
  try {
    const [paidOrders, totalProducts, totalCustomers, recentOrders, allOrders] = await Promise.all([
      prisma.order.findMany({ where: { status: "paid" } }),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

    const statusCounts = allOrders.reduce((acc: any, o) => {
      acc[o.shippingStatus] = (acc[o.shippingStatus] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalRevenue,
      totalOrders: allOrders.length,
      paidOrders: paidOrders.length,
      totalProducts,
      totalCustomers,
      recentOrders,
      statusCounts,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// --- PAYMENTS (RAZORPAY) ---
app.post("/api/orders/create", async (req, res) => {
  try {
    const { amount, currency, customer, items, userId, billingAddress, shippingCountry } = req.body;

    // Ship only within India. Authoritative gate (client check is just UX).
    // Missing/blank country is treated as India for backward compatibility.
    if (shippingCountry && shippingCountry.trim() && shippingCountry.trim().toLowerCase() !== "india") {
      return res.status(403).json({ error: "We currently ship only within India." });
    }

    // Authoritative stock check: reject if any line exceeds available per-size
    // stock. Colours with no sizeStock configured are unlimited (backward compat).
    for (const it of (items || [])) {
      if (!it?.id || !it?.color || !it?.size) continue;
      const color = await prisma.color.findFirst({
        where: { productId: it.id, name: it.color },
      });
      if (!color?.sizeStock) continue;
      const stock = JSON.parse(color.sizeStock);
      const available = stock[it.size];
      if (available != null && (it.quantity || 1) > available) {
        return res.status(409).json({
          error: available <= 0
            ? `${it.name || "An item"} (${it.size}) is sold out.`
            : `Only ${available} left of ${it.name || "an item"} in size ${it.size}.`,
        });
      }
    }

    const options = {
      amount: Math.round(amount * 100), // in paise
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await getRazorpayClient().orders.create(options);

    await prisma.order.create({
      data: {
        orderId: order.id,
        amount,
        currency: options.currency,
        status: "created",
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        address: customer.address,
        billingAddress: billingAddress || null,
        items: JSON.stringify(items),
        userId: userId || null,
      }
    });

    res.json(order);
  } catch (error: any) {
    console.error("Order creation failed:", error);
    if (error?.statusCode === 401) {
      return res.status(502).json({
        error: "Razorpay authentication failed. Check the live key ID and secret.",
      });
    }
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.post("/api/orders/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const { key_secret } = getRazorpayConfig(process.env);
    const expectedSign = crypto
      .createHmac("sha256", key_secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const paidOrder = await prisma.order.update({
        where: { orderId: razorpay_order_id },
        data: {
          status: "paid",
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
        },
      });

      // Decrement per-colour, per-size stock for the purchased items.
      // Never let a stock hiccup block a confirmed payment.
      try {
        const orderItems = JSON.parse(paidOrder.items || "[]");
        for (const it of orderItems) {
          if (!it?.id || !it?.color || !it?.size) continue;
          const color = await prisma.color.findFirst({
            where: { productId: it.id, name: it.color },
          });
          if (!color?.sizeStock) continue;
          const stock = JSON.parse(color.sizeStock);
          if (stock[it.size] == null) continue;
          stock[it.size] = Math.max(0, stock[it.size] - (it.quantity || 1));
          await prisma.color.update({
            where: { id: color.id },
            data: { sizeStock: JSON.stringify(stock) },
          });
        }
      } catch (e) {
        console.error("Stock decrement failed (payment still confirmed):", e);
      }

      // Notify support of the new paid order (fire-and-forget; never blocks).
      try {
        await sendOrderNotification({
          orderId: paidOrder.orderId,
          amount: paidOrder.amount,
          customerName: paidOrder.customerName,
          customerEmail: paidOrder.customerEmail,
          customerPhone: paidOrder.customerPhone,
          address: paidOrder.address,
          items: JSON.parse(paidOrder.items || "[]"),
        });
      } catch (e) {
        console.error("Order notification email failed (payment still confirmed):", e);
      }
      try {
        await sendCustomerConfirmation({
          orderId: paidOrder.orderId,
          amount: paidOrder.amount,
          customerName: paidOrder.customerName,
          customerEmail: paidOrder.customerEmail,
          address: paidOrder.address,
          items: JSON.parse(paidOrder.items || "[]"),
        });
      } catch (e) {
        console.error("Customer confirmation email failed (payment still confirmed):", e);
      }

      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ error: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

// --- CONTACT FORM ---
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!message || !email) {
    return res.status(400).json({ error: "Email and message are required." });
  }
  if (!isMailConfigured()) {
    // Not set up yet — tell the client to fall back to opening a mail draft.
    return res.status(503).json({ error: "Email not configured", fallback: true });
  }
  try {
    await sendContactEmail({
      name: name || "Website visitor",
      email,
      subject: subject || "General Inquiry",
      message,
    });
    res.json({ ok: true });
  } catch (e) {
    console.error("Contact email failed:", e);
    res.status(502).json({ error: "Could not send message", fallback: true });
  }
});

// --- AUTH ---
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const user = await prisma.user.create({
      data: { email, password, firstName, lastName },
      include: { addresses: true }
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { addresses: true }
  });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.json(user);
});

app.put("/api/auth/profile", async (req, res) => {
  const { email, firstName, lastName, phone } = req.body;
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { firstName, lastName, phone },
      include: { addresses: true }
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
});

app.post("/api/auth/address", async (req, res) => {
  const { userId, address } = req.body;
  try {
    await prisma.address.create({
      data: { ...address, userId }
    });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true }
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Failed to add address" });
  }
});

// --- SEARCH ---
app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ products: [], collections: [] });
  const query = q as string;
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query } }
      ]
    },
    include: { colors: true }
  });
  const collections = await prisma.collection.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query } }
      ]
    }
  });
  res.json({ products, collections });
});

// --- ORDERS ---
app.get("/api/orders", async (req, res) => {
  try {
    const { status, search } = req.query;
    // Never return "created" orders — those are abandoned payment attempts
    const where: any = { status: { in: ["paid", "failed"] } };
    if (status && status !== "all") where.shippingStatus = status;
    if (search) {
      where.OR = [
        { customerName: { contains: search as string } },
        { customerEmail: { contains: search as string } },
        { orderId: { contains: search as string } },
      ];
    }
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { user: true }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/api/orders/user/:userId", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
});

app.get("/api/orders/track", async (req, res) => {
  const { orderId, email } = req.query;
  if (typeof orderId !== "string" || typeof email !== "string" || !orderId.trim() || !email.trim()) {
    return res.status(400).json({ error: "Order ID and email are required" });
  }
  try {
    const order = await prisma.order.findUnique({
      where: { orderId },
      select: {
        orderId: true,
        amount: true,
        currency: true,
        status: true,
        shippingStatus: true,
        customerEmail: true,
        address: true,
        items: true,
        createdAt: true,
      },
    });
    if (!order || order.customerEmail.toLowerCase() !== email.trim().toLowerCase()) {
      return res.status(404).json({ error: "Order not found. Please check your Order ID and email." });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { user: true }
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

app.put("/api/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { shippingStatus } = req.body;
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { shippingStatus }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// --- CUSTOMERS ---
app.get("/api/customers", async (req, res) => {
  try {
    const customers = await prisma.user.findMany({
      include: {
        _count: {
          select: { orders: true }
        },
        addresses: true
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

app.get("/api/customers/:id", async (req, res) => {
  try {
    const customer = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        addresses: true,
        orders: { orderBy: { createdAt: "desc" } }
      }
    });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

// --- MEDIA ---
app.get("/api/media", async (req, res) => {
  const dir = uploadDir;
  if (!fs.existsSync(dir)) return res.json([]);

  const files = fs.readdirSync(dir);
  const media = files
    .filter(f => !f.startsWith("."))
    .map(f => ({
      id: f,
      name: f,
      url: `${req.protocol}://${req.get("host")}/uploads/${f}`,
      uploadedAt: fs.statSync(path.join(dir, f)).mtime
    }));
  res.json(media);
});

app.delete("/api/media/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    // Prevent path traversal
    const safeName = path.basename(filename);
    const filePath = path.join(uploadDir, safeName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete file" });
  }
});

// --- MEDIA UPLOAD ---
app.post("/api/upload", upload.array("files"), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) return res.status(400).send("No files uploaded.");

  const results = [];

  for (const file of files) {
    const filePath = file.path;
    const fileName = file.filename;
    const ext = path.extname(fileName).toLowerCase();

    if (ext === ".mp4" || ext === ".mov" || ext === ".webm" || ext === ".avi") {
      // Compress video: scale to max 1080p, H.264 CRF 28, fast preset, strip audio metadata
      const compressedName = fileName.replace(ext, "_compressed.mp4");
      const compressedPath = path.join(uploadDir, compressedName);
      try {
        await new Promise<void>((resolve, reject) => {
          const { exec } = require("child_process");
          const cmd = `ffmpeg -i "${filePath}" -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" -c:v libx264 -crf 28 -preset fast -movflags +faststart -c:a aac -b:a 128k -y "${compressedPath}"`;
          exec(cmd, (err: any) => err ? reject(err) : resolve());
        });
        fs.unlinkSync(filePath); // remove original
        results.push({
          url: `${req.protocol}://${req.get("host")}/uploads/${compressedName}`,
          name: compressedName
        });
      } catch (e) {
        // ffmpeg failed — fall back to original
        results.push({
          url: `${req.protocol}://${req.get("host")}/uploads/${fileName}`,
          name: fileName
        });
      }
    } else {
      const imageExts = [".jpg", ".jpeg", ".png"];
      if (imageExts.includes(ext)) {
        // Keep the original filename/URL. nginx content-negotiates on Accept
        // and serves "<fileName>.webp" to browsers that support it, falling
        // back to the (now shrunk) original for the rest. BlurImage derives
        // the "<base>-lqip<ext>" placeholder from the same URL.
        const baseName = fileName.replace(/\.[^.]+$/, "");
        const webpPath = filePath + ".webp"; // files-x.jpg.webp
        const lqipPath = path.join(uploadDir, baseName + "-lqip" + ext);
        const tmpPath = filePath + ".tmp";
        try {
          await sharp(filePath)
            .resize({ width: 1600, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(webpPath);

          await sharp(filePath)
            .resize({ width: 24 })
            .blur(2)
            .jpeg({ quality: 30 })
            .toFile(lqipPath);

          // Shrink the fallback original so we never store a 12MB+ raw upload.
          await sharp(filePath)
            .resize({ width: 1600, withoutEnlargement: true })
            .jpeg({ quality: 82 })
            .toFile(tmpPath);
          fs.renameSync(tmpPath, filePath);
        } catch (e) {
          // Conversion failed — keep the raw original as the served file.
        }
      }
      results.push({
        url: `${req.protocol}://${req.get("host")}/uploads/${fileName}`,
        name: fileName,
      });
    }
  }

  res.json(results);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  if (!isMailConfigured()) console.warn("WARNING: SMTP_PASS not set — order/contact emails are DISABLED.");
});
