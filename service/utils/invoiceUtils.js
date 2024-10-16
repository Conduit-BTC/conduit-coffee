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
    const data = await status.json();
    if (data.state) return data.state;
    return 'ERROR';
  } catch (error) {
    throw new Error('Error checking invoice status:', error);
  }
}

async function processPaidOrder(invoiceId) {
  const order = await prisma.order.findFirst({
    where: {
      invoiceId: invoiceId
    }
  });

  if (!order) return false;

  const updatedOrder = await prisma.order.update({
    where: {
      id: order.id
    },
    data: {
      invoiceStatus: 'paid',
    },
  });

  if (updatedOrder?.affectedRows == 0) return false;
  return true;
}

module.exports = { addInvoiceToOrder, voidOrder, processPaidOrder, checkInvoiceStatus };
