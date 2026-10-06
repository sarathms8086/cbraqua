import type { SiteSettings } from "@/contexts/AdminContext";

interface OrderItem {
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

interface InvoiceOrder {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  billingAddress?: string;
  items: string;
  amount: number;
  createdAt: string;
  status: string;
}

export function downloadInvoice(order: InvoiceOrder, settings: SiteSettings) {
  const items: OrderItem[] = JSON.parse(order.items || "[]");
  const gstRate = settings.gstPercent || 0;
  const taxable = gstRate > 0 ? Math.round(order.amount * 100 / (100 + gstRate)) : order.amount;
  const gstAmt = order.amount - taxable;
  const cgst = Math.round(gstAmt / 2);
  const sgst = gstAmt - cgst;
  const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });

  const gstColHeaders = gstRate > 0
    ? `<th class="right">CGST (${gstRate / 2}%)</th><th class="right">SGST (${gstRate / 2}%)</th>`
    : "";

  const itemRows = items.map((item, i) => {
    const lineTotal = item.price * item.quantity;
    const lineTaxable = gstRate > 0 ? Math.round(lineTotal * 100 / (100 + gstRate)) : lineTotal;
    const lineGst = lineTotal - lineTaxable;
    const lineCgst = Math.round(lineGst / 2);
    const lineSgst = lineGst - lineCgst;
    const gstCells = gstRate > 0
      ? `<td class="right">₹${lineCgst.toLocaleString("en-IN")}</td><td class="right">₹${lineSgst.toLocaleString("en-IN")}</td>`
      : "";
    return `<tr>
      <td>${i + 1}</td>
      <td>${item.name}<br><span class="sub">${item.color} / ${item.size}</span></td>
      <td class="center">${item.quantity}</td>
      <td class="right">₹${item.price.toLocaleString("en-IN")}</td>
      <td class="right">₹${lineTaxable.toLocaleString("en-IN")}</td>
      ${gstCells}
      <td class="right">₹${lineTotal.toLocaleString("en-IN")}</td>
    </tr>`;
  }).join("");

  const gstTotalsRows = gstRate > 0 ? `
    <tr><td>Taxable Amount</td><td class="right">₹${taxable.toLocaleString("en-IN")}</td></tr>
    <tr><td>CGST (${gstRate / 2}%)</td><td class="right">₹${cgst.toLocaleString("en-IN")}</td></tr>
    <tr><td>SGST (${gstRate / 2}%)</td><td class="right">₹${sgst.toLocaleString("en-IN")}</td></tr>
  ` : "";

  const brandName = settings.brandName || "DANYWENS";
  const billingAddr = (order.billingAddress || order.address).replace(/\n/g, "<br>");
  const shippingAddr = order.address.replace(/\n/g, "<br>");
  const paidBadge = order.status === "paid"
    ? '<span style="background:#e6f7ee;color:#166534;font-size:9px;font-weight:bold;letter-spacing:.1em;padding:3px 10px;border-radius:20px;text-transform:uppercase;">✓ Paid</span>'
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Invoice ${order.orderId}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:40px;max-width:800px;margin:0 auto}
.brand{font-size:28px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
.tagline{font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:#666;margin-top:2px}
.divider{border:none;border-top:2px solid #111;margin:20px 0}
.divider-sm{border:none;border-top:1px solid #ddd;margin:16px 0}
.two-col{display:flex;gap:40px;margin:20px 0}
.two-col>div{flex:1}
.lbl{font-size:9px;font-weight:bold;letter-spacing:.2em;text-transform:uppercase;color:#999;margin-bottom:6px}
.val{font-size:12px;line-height:1.6}
table{width:100%;border-collapse:collapse;margin-top:16px;font-size:11px}
th{background:#111;color:#fff;padding:8px 10px;text-align:left;font-size:9px;letter-spacing:.12em;text-transform:uppercase}
td{padding:8px 10px;border-bottom:1px solid #eee}
td.right,th.right{text-align:right}
td.center,th.center{text-align:center}
.sub{font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.1em}
.totals{margin-top:16px;display:flex;justify-content:flex-end}
.tt{width:280px;font-size:12px;border-collapse:collapse}
.tt td{padding:4px 10px;border:none}
.tt tr.grand td{border-top:2px solid #111;font-size:14px;font-weight:bold;padding-top:8px}
.footer{margin-top:40px;text-align:center;font-size:9px;color:#999;letter-spacing:.15em;text-transform:uppercase}
.print-btn{position:fixed;top:20px;right:20px;background:#111;color:#fff;border:none;padding:10px 20px;font-size:11px;letter-spacing:.15em;text-transform:uppercase;cursor:pointer}
.print-btn:hover{background:#333}
@media print{.no-print{display:none}body{padding:20px}}
</style>
</head>
<body>
<button class="print-btn no-print" onclick="window.print()">Save as PDF</button>
<div style="display:flex;justify-content:space-between;align-items:flex-start">
  <div>
    <div class="brand">${brandName}</div>
    <div class="tagline">Fashion &amp; Lifestyle</div>
  </div>
  <div style="text-align:right">
    <div style="font-size:18px;font-weight:bold;text-transform:uppercase;letter-spacing:.15em">Tax Invoice</div>
    <div style="font-size:11px;color:#555;margin-top:4px">
      <strong>Invoice #:</strong> ${order.orderId}<br>
      <strong>Date:</strong> ${invoiceDate}
    </div>
    <div style="margin-top:6px">${paidBadge}</div>
  </div>
</div>
<hr class="divider">
<div class="two-col">
  <div>
    <div class="lbl">Bill To</div>
    <div class="val"><strong>${order.customerName}</strong><br>${billingAddr}<br>${order.customerPhone}<br>${order.customerEmail}</div>
  </div>
  <div>
    <div class="lbl">Ship To</div>
    <div class="val">${shippingAddr}</div>
  </div>
</div>
<hr class="divider">
<table>
  <thead>
    <tr>
      <th>#</th><th>Item</th><th class="center">Qty</th><th class="right">Unit Price</th><th class="right">Taxable Value</th>
      ${gstColHeaders}
      <th class="right">Total</th>
    </tr>
  </thead>
  <tbody>${itemRows}</tbody>
</table>
<div class="totals">
  <table class="tt">
    ${gstTotalsRows}
    <tr class="grand">
      <td>Grand Total</td>
      <td class="right">₹${order.amount.toLocaleString("en-IN")}</td>
    </tr>
  </table>
</div>
<hr class="divider-sm" style="margin-top:30px">
<div class="footer">Thank you for shopping with ${brandName} &nbsp;·&nbsp; Computer-generated invoice</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
