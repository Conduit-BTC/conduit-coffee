const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 *
 * orderData = {
    orderId: "123456",
    date: "2024-03-21",
    payment: {
      grandTotal: 150000,
      donation: 5000
    },
    blockHeight: 1234567,
    inventory: [
      { name: "Quantum Processor", qty: 2 },
      { name: "Neural Interface", qty: 1 },
      { name: "Quantum Memory Module", qty: 3 }
    ]
  };
*/

async function generateCollectorCardPDF(orderData) {
  // Create HTML content with the order data
  const htmlPath = path.join(__dirname, 'template.html');

  const inventoryHTML = orderData.inventory
    .map(item => `<div class="inventory-item">${item.qty}x ${item.name}</div>`)
    .join('\n            ');

  const htmlContent = fs.readFileSync(htmlPath, 'utf8')
    .replace('DATA:ORDER_ID', orderData.orderId)
    .replace('DATA:TIMESTAMP', orderData.date)
    .replace('DATA:GRAND_TOTAL', orderData.payment.grandTotal)
    .replace('DATA:DONATION_TOTAL', orderData.payment.donation)
    .replace('DATA:BLOCK_HEIGHT', orderData.blockHeight)
    .replace('DATA:INVENTORY', inventoryHTML);

  // Start browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the viewport to match the card dimensions (4x6 inches at 96 DPI)
  await page.setViewport({
    width: 384,  // 4 inches * 96 DPI
    height: 576, // 6 inches * 96 DPI
    deviceScaleFactor: 2,
  });

  // Load the HTML content
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0'
  });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');

  // Generate PDF
  const pdf = await page.pdf({
    width: '4in',
    height: '6in',
    printBackground: true,
    preferCSSPageSize: true
  });

  await browser.close();
  return pdf;
}

module.exports = { generateCollectorCardPDF };
