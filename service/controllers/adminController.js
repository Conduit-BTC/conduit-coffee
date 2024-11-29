const { dbService } = require('../services/dbService');
const prisma = dbService.getPrismaClient();
const emailService = require('../services/emailService');
const { generateReceiptDetailsObject } = require('../utils/receiptUtils');

exports.exportOrdersCsv = async (_, res) => {
  console.log('exportOrdersCsv');
  try {
    const data = await prisma.order.findMany();
    const csvData = convertToCSV(data);
    const filename = generateFilename('orders');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  } catch (error) {
    console.error('Error exporting orders CSV:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.exportProductsCsv = async (_, res) => {
  console.log('exportProductsCsv');
  try {
    const data = await prisma.product.findMany();
    const csvData = convertToCSV(data);
    const filename = generateFilename('products');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  } catch (error) {
    console.error('Error exporting products CSV:', error);
    res.status(500).send('Internal Server Error');
  }
};

function convertToCSV(data) {
  const headers = Object.keys(data[0]);
  const rows = data.map((obj) =>
    Object.values(obj)
      .map((value) => `"${value}"`)
      .join(','),
  );
  return [headers.join(','), ...rows].join('\n');
}

function generateFilename(name) {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();
  return `${name}-${day}-${month}-${year}.csv`;
}

exports.sendReceiptTestEmail = async (req, res) => {
  console.log('sendReceiptTestEmail');
  try {
    const { invoiceId } = req.params;
    await emailService.sendInvoicePaidEmail(invoiceId, {});
    res.send('Email sent successfully.');
  } catch (error) {
    console.error('Error sending test receipt email:', error);
    res.status(500).send('Internal Server Error');
  }
}

exports.generateReceiptDetails = async (req, res) => {
  console.log('generateReceiptDetails');
  try {
    const { id } = req.params;
    const details = await generateReceiptDetailsObject(id);
    res.status(200).json(details);
  } catch (error) {
    console.error('Error generating receipt details:', error);
    res.status(500).send('Internal Server Error');
  }
}
