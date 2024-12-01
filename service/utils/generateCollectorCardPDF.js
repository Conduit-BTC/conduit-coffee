const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateCollectorCardPDF(orderData) {
  // Create HTML content with the order data
  const htmlPath = path.join(__dirname, 'template.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8')
    .replace('ad9d73bc-5c7f-41de-850c-12ee21ff0e64', orderData.orderId)
    .replace('November 29, 2024 at 10:40 PM PST', orderData.date)
    .replace('150000', orderData.payment.grandTotal)
    .replace('15000', orderData.payment.donation);

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

module.exports = generateCollectorCardPDF;
