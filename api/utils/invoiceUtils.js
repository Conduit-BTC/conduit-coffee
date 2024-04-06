const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addInvoiceToOrder(data) {
  const { invoiceId, metadata } = data;
  if (!metadata?.orderId) return false;
  const { orderId } = metadata;

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      invoiceId: invoiceId,
      invoiceStatus: 'pending',
    },
  });

  if (updatedOrder?.affectedRows == 0) {
    throw new Error(
      `invoiceController.js # addInvoiceToOrder() - Order wasn't found. Order ID: ${orderId} - Invoice ID: ${invoiceId}`,
    );
  }
  return true;
}

async function voidOrder(data) {
  const { invoiceId, metadata } = data;
  if (!metadata?.orderId) return false;
  const { orderId } = metadata;

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      invoiceStatus: 'expired',
    },
  });

  if (updatedOrder?.affectedRows == 0) {
    throw new Error(
      `invoiceController.js # voidOrder() - Invoice wasn't found. Invoice ID: ${invoiceId}`,
    );
  }
  return true;
}

async function processPaidOrder(data) {
  const { invoiceId, metadata } = data;
  if (!metadata?.orderId) return false;
  const { orderId } = metadata;

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      invoiceStatus: 'paid',
    },
  });

  if (updatedOrder?.affectedRows == 0) {
    throw new Error(
      `invoiceController.js # processPaidOrder() - Invoice wasn't found. Invoice ID: ${invoiceId}`,
    );
  }
  return true;
}

module.exports = { addInvoiceToOrder, voidOrder, processPaidOrder };
