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
  // Send order to ShipStation
  return true;
}

module.exports = { addInvoiceToOrder, voidOrder, processPaidOrder };
