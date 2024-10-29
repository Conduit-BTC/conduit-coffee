const { dbService } = require('../services/dbService');
const prisma = dbService.getPrismaClient();


const InvoiceStatus = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  EXPIRED: 'EXPIRED',
}

async function addInvoiceToOrder(invoiceId, orderId) {
  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      invoiceId: invoiceId,
      invoiceStatus: InvoiceStatus.PENDING,
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
      invoiceStatus: InvoiceStatus.EXPIRED,
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

module.exports = { addInvoiceToOrder, voidOrder, checkInvoiceStatus, InvoiceStatus };
