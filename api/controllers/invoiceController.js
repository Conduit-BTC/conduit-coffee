const { PrismaClient } = require('@prisma/client');
const { verifySignature } = require('../utils/verifySignature');
const prisma = new PrismaClient();

exports.settleInvoice = async (req, _) => {
  const isValid = await validateRequest(req);
  if (!isValid) {
    console.error('Unauthorized request! - ' + req);
    return;
  }

  switch (req.body.type) {
    case 'InvoiceSettled':
      processPaidOrder(req.body);
    case 'InvoiceExpired' || 'InvoiceInvalid':
      voidOrder(req.body);
    case 'InvoiceCreated':
      addInvoiceToOrder(req.body);
    default:
      return;
  }
};

async function validateRequest(req) {
  const secret = process.env.BTCPAY_INVOICE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('invoiceController.js - Missing ENV Variable');
  }
  const header = req.get('BTCPay-Sig');
  const isValid = await verifySignature(secret, header, req.body);
  return isValid;
}

async function addInvoiceToOrder(data) {
  const { invoiceId, timestamp, metadata } = data;
  const { orderId } = metadata;

  console.log(
    `Invoice added to Order: Invoice ID: ${invoiceId} - Time: ${timestamp} - Order ID: ${orderId}`,
  );

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      invoiceId: invoiceId,
      invoiceStatus: 'pending',
    },
  });

  // If success, return success
}

async function voidOrder(data) {
  const { invoiceId, timestamp, metadata } = data;
  const { orderId } = metadata;

  console.log(
    `Invoice expired/Invalid: ${invoiceId} - Time: ${timestamp} - Order ID: ${orderId}`,
  );

  const voidOrder = await prisma.order.update({
    where: {
      invoiceId: invoiceId,
    },
    data: {
      invoiceStatus: 'expired',
    },
  });

  // If success, return success
}

async function processPaidOrder(data) {
  const { invoiceId, timestamp, metadata } = data;
  const { orderId } = metadata;

  console.log(
    `Invoice paid: ${invoiceId} - Time: ${timestamp} - Order ID: ${orderId}`,
  );

  const updatedOrder = await prisma.order.update({
    where: {
      invoiceId: invoiceId,
    },
    data: {
      invoiceId: invoiceId,
      invoiceStatus: 'paid',
    },
  });

  // If success, return success
}
