const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Convert points to inches (72 points = 1 inch)
const inch = 72;

async function generateCollectorCardPDF(orderData) {
  // Create a new PDF document
  const doc = new PDFDocument({
    size: [4 * inch, 6 * inch],
    margin: 0
  });

  // Register font
  const fontPath = path.join(__dirname, 'fonts', 'ShareTechMono-Regular.ttf');
  doc.registerFont('ShareTechMono', fontPath);
  doc.font('ShareTechMono');

  // Main border
  const margin = 12;
  const borderWidth = 2;
  doc.lineWidth(borderWidth);
  doc.rect(margin, margin, 4 * inch - 2 * margin, 6 * inch - 2 * margin).stroke();

  // Content area measurements
  const contentMargin = margin + 20;
  const contentWidth = 4 * inch - 2 * contentMargin;
  const centerX = 2 * inch;

  // Header
  doc.fontSize(14);
  doc.text('COFFEE BY', 0, contentMargin, { align: 'center', characterSpacing: 4 });

  // Lines around brand
  const brandY = contentMargin + 25;
  doc.lineWidth(2);
  doc.moveTo(contentMargin + 45, brandY).lineTo(4 * inch - contentMargin - 50, brandY).stroke();

  doc.fontSize(28);
  doc.text('CONDUIT', 0, brandY + 5, { align: 'center', characterSpacing: 4 });

  doc.moveTo(contentMargin + 45, brandY + 40).lineTo(4 * inch - contentMargin - 50, brandY + 40).stroke();

  // Order details - with right justification
  doc.fontSize(8); // Smaller text size
  const orderY = brandY + 70;
  doc.lineWidth(2);
  doc.moveTo(contentMargin, orderY).lineTo(contentMargin, orderY + 70).stroke();

  const detailsX = contentMargin + 15;
  const rightAlignX = 120; // Right margin for aligned text

  // ORDER_ID with right justification
  doc.text('ORDER_ID:', detailsX, orderY);
  doc.text(orderData.orderId, rightAlignX - 20, orderY, { align: 'left' });

  // TIMESTAMP with right justification
  doc.text('TIMESTAMP:', detailsX, orderY + 30);
  doc.text(orderData.date, rightAlignX - 8, orderY + 30, { align: 'left' });

  // BTC_BLOCKHEIGHT with right justification
  doc.text('BTC_BLOCKHEIGHT:', detailsX, orderY + 60);
  doc.text(orderData.blockHeight.toString(), rightAlignX + 105, orderY + 60, { align: 'left' });

  // Payment box
  const paymentY = orderY + 90;
  doc.rect(contentMargin, paymentY, contentWidth, 70).stroke();
  doc.fontSize(11);
  doc.text('PAYMENT_DETAILS', 0, paymentY + 10, { align: 'center' });
  doc.fontSize(8);
  doc.text(`GRAND_TOTAL: ${orderData.payment.grandTotal} SATS`, detailsX, paymentY + 30);
  doc.text(`OPENSATS_DONATION: ${orderData.payment.donation} SATS`, detailsX, paymentY + 45);

  // Inventory manifest
  const manifestY = paymentY + 90;
  doc.fontSize(11);
  doc.text('INVENTORY_MANIFEST', 0, manifestY, { align: 'center' });

  // Inventory items
  doc.fontSize(8);
  let currentY = manifestY + 30;
  doc.lineWidth(2);
  doc.moveTo(contentMargin, currentY - 10).lineTo(contentMargin, currentY + (orderData.inventory.length * 20)).stroke();

  orderData.inventory.forEach(item => {
    doc.text(`> ${item.qty}x ${item.name}`, detailsX, currentY);
    currentY += 20;
  });

  // Footer with decorative lines
  doc.fontSize(8);
  const footerY = 6 * inch - margin - 20;
  const lineLength = 73; // Length of decorative lines

  // Draw left line
  doc.moveTo(centerX - lineLength - 40, footerY - 2).lineTo(centerX - 50, footerY - 2).stroke();

  // Draw text
  doc.text('conduitbtc.com', 0, footerY - 7, { align: 'center', characterSpacing: 2 });

  // Draw right line
  doc.moveTo(centerX + 50, footerY - 2).lineTo(centerX + lineLength + 40, footerY - 2).stroke();

  // Return the PDF as a Buffer
  return new Promise((resolve, reject) => {
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

module.exports = { generateCollectorCardPDF };
