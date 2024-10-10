const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addInvoiceToOrder(invoiceId, orderId) {
  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      invoiceId: invoiceId,
      invoiceStatus: 'pending',
    },
  });

  if (updatedOrder?.affectedRows == 0) return false;
  return true;
}

async function voidOrder(orderId) {
  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      invoiceStatus: 'expired',
    },
  });

  if (updatedOrder?.affectedRows == 0) return false;
  return true;
}

async function checkInvoiceStatus(invoiceId) {
  try {
    const status = await fetch(`https://api.strike.me/v1/invoices/${invoiceId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.STRIKE_API_KEY}`,
      }
    });
    if (status.state) return status.state;
  } catch (error) {
    throw new Error('Error checking invoice status:', error);
  }
}

async function processPaidOrder(orderId) {
  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      invoiceStatus: 'paid',
    },
  });

  if (updatedOrder?.affectedRows == 0) return false;
  // Send order to shipping provider
  return true;
}

module.exports = { addInvoiceToOrder, voidOrder, processPaidOrder };
