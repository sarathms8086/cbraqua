import type { SiteSettings } from "@/contexts/AdminContext";

export function exportGSTCsv(orders: any[], settings: SiteSettings) {
  const gstRate = settings.gstPercent || 0;
  const halfRate = gstRate / 2;
  const brandName = settings.brandName || "danywens";

  const headers = [
    "Invoice No",
    "Invoice Date",
    "Customer Name",
    "Customer Phone",
    "Customer Email",
    "Billing Address",
    "Items",
    "Taxable Amount (INR)",
    `CGST @ ${halfRate}%`,
    `SGST @ ${halfRate}%`,
    "Total Amount (INR)",
    "Payment Status",
    "Shipping Status",
  ];

  const rows = orders.map((order) => {
    const items = JSON.parse(order.items || "[]");
    const itemDesc = items
      .map((it: any) => `${it.name} (${it.color}/${it.size}) x${it.quantity}`)
      .join("; ");
    const taxable = gstRate > 0 ? Math.round(order.amount * 100 / (100 + gstRate)) : order.amount;
    const gstAmt = order.amount - taxable;
    const cgst = Math.round(gstAmt / 2);
    const sgst = gstAmt - cgst;
    const paymentLabel =
      order.status === "paid" ? "Paid" :
      order.status === "created" ? "Pending" :
      order.status === "failed" ? "Failed" :
      order.status;

    return [
      order.orderId,
      new Date(order.createdAt).toLocaleDateString("en-IN"),
      order.customerName,
      order.customerPhone || "",
      order.customerEmail,
      (order.billingAddress || order.address || "").replace(/\n/g, " "),
      itemDesc,
      taxable,
      cgst,
      sgst,
      order.amount,
      paymentLabel,
      order.shippingStatus || "Pending",
    ];
  });

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
    )
    .join("\r\n");

  // UTF-8 BOM so Excel opens it without encoding issues
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${brandName}-GST-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
