import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateDailyReport(
  stats: any,
  orders: any[]
) {
  const doc = new jsPDF();

  const today = new Date();

  // Title
  doc.setFontSize(22);
  doc.setTextColor(255, 102, 0);
  doc.text("MANNA KITCHEN", 14, 20);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Daily Sales Report", 14, 30);

  doc.setFontSize(11);

  doc.text(
    `Date: ${today.toLocaleDateString()}`,
    14,
    40
  );

  doc.text(
    `Generated: ${today.toLocaleTimeString()}`,
    14,
    47
  );

  doc.text(`Today's Sales: ₹${stats.totalSales}`, 14, 60);
  doc.text(`Orders: ${stats.orderCount}`, 14, 67);
  doc.text(`Customers: ${stats.customerCount}`, 14, 74);

  doc.text(`Pending: ${stats.pendingCount}`, 110, 60);
  doc.text(`Accepted: ${stats.acceptedCount}`, 110, 67);
  doc.text(`Preparing: ${stats.preparingCount}`, 110, 74);
  doc.text(
    `Out For Delivery: ${stats.outForDeliveryCount}`,
    110,
    81
  );
  doc.text(`Delivered: ${stats.deliveredCount}`, 110, 88);
  doc.text(`Rejected: ${stats.rejectedCount}`, 110, 95);

  autoTable(doc, {
    startY: 105,

    head: [
      [
        "Order",
        "Customer",
        "Amount",
        "Status",
        "Time",
      ],
    ],

    body: orders.map((order) => [
      `#${order.id}`,
      order.customers?.full_name ?? "-",
      `₹${order.total}`,
      order.status,
      new Date(order.created_at).toLocaleTimeString(),
    ]),
  });

  doc.save(
    `MANNA_KITCHEN_${today
      .toISOString()
      .slice(0, 10)}.pdf`
  );
}