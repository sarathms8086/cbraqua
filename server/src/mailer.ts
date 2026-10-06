import nodemailer from "nodemailer";

// SMTP config comes from environment (server .env). When SMTP_PASS is unset,
// mail is considered "not configured" and callers fall back gracefully.
const SMTP_HOST = process.env.SMTP_HOST || "smtpout.secureserver.net";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_USER = process.env.SMTP_USER || "hello@danywens.com";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || SMTP_USER;

export function isMailConfigured(): boolean {
  return Boolean(SMTP_PASS && !SMTP_PASS.includes("placeholder"));
}

let transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // SSL on 465, STARTTLS otherwise
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

const esc = (s: string) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Contact form → support inbox. Reply-To is the customer so you just hit Reply. */
export async function sendContactEmail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!isMailConfigured()) throw new Error("MAIL_NOT_CONFIGURED");
  const html = `
    <h2 style="font-family:Arial,sans-serif">New contact form message</h2>
    <p style="font-family:Arial,sans-serif"><strong>Name:</strong> ${esc(input.name)}<br>
    <strong>Email:</strong> ${esc(input.email)}<br>
    <strong>Subject:</strong> ${esc(input.subject)}</p>
    <hr>
    <p style="font-family:Arial,sans-serif;white-space:pre-wrap">${esc(input.message)}</p>`;
  return getTransporter().sendMail({
    from: `"Danywens Website" <${SMTP_USER}>`,
    to: SUPPORT_EMAIL,
    replyTo: input.email ? `"${input.name}" <${input.email}>` : undefined,
    subject: `[Contact] ${input.subject} — ${input.name}`,
    text: `Name: ${input.name}\nEmail: ${input.email}\nSubject: ${input.subject}\n\n${input.message}`,
    html,
  });
}

/** New paid order → support inbox. Fire-and-forget from the verify handler. */
export async function sendOrderNotification(order: {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: any[];
}) {
  if (!isMailConfigured()) return;
  const rows = (order.items || [])
    .map(
      (it) =>
        `<tr><td style="padding:4px 8px;border-bottom:1px solid #eee">${esc(it.name)} (${esc(it.color)}/${esc(it.size)})</td><td style="padding:4px 8px;border-bottom:1px solid #eee;text-align:center">${esc(String(it.quantity))}</td><td style="padding:4px 8px;border-bottom:1px solid #eee;text-align:right">₹${esc(String(it.price))}</td></tr>`
    )
    .join("");
  const html = `
    <h2 style="font-family:Arial,sans-serif">New paid order — ${esc(order.orderId)}</h2>
    <p style="font-family:Arial,sans-serif">
      <strong>Customer:</strong> ${esc(order.customerName)}<br>
      <strong>Email:</strong> ${esc(order.customerEmail)}<br>
      <strong>Phone:</strong> ${esc(order.customerPhone)}<br>
      <strong>Ship to:</strong> ${esc(order.address)}</p>
    <table style="font-family:Arial,sans-serif;border-collapse:collapse;width:100%;max-width:600px">
      <thead><tr><th style="text-align:left;padding:4px 8px">Item</th><th style="padding:4px 8px">Qty</th><th style="text-align:right;padding:4px 8px">Price</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="font-family:Arial,sans-serif;font-size:16px"><strong>Total: ₹${esc(String(order.amount))}</strong></p>`;
  return getTransporter().sendMail({
    from: `"Danywens Orders" <${SMTP_USER}>`,
    to: SUPPORT_EMAIL,
    replyTo: order.customerEmail ? `"${order.customerName}" <${order.customerEmail}>` : undefined,
    subject: `New Order ₹${order.amount} — ${order.customerName} (${order.orderId})`,
    html,
  });
}
