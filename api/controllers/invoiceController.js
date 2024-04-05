const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.settleInvoice = async (req, _) => {
  switch (req.body.type) {
    case 'InvoiceSettled':
      processPaidOrder(req.body);
    case 'InvoiceExpired':
        voidOrder(req.body);
    case 'InvoiceCreated':
        addInvoiceToOrder(req.body);
    default:
      console.log(
        `Invoice request received: ${req.body.type} - Invoice ID ${req.body.invoiceId} - All data: ${req.body}`,
      );
  }
};

async function addInvoiceToOrder(data) {
  const { invoiceId, metadata } = data;
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
}


async function voidOrder(data) {
  const { invoiceId, metadata } = data;
  const { orderId } = metadata;
  const voidOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      invoiceStatus: 'expired',
    },
  });
}

async function processPaidOrder(data) {
  const { invoiceId, timestamp, metadata } = data;
  const { orderId } = metadata;

  console.log(
    `Invoice settled: ${invoiceId} - Time: ${timestamp} - Order ID: ${orderId}`,
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
}
