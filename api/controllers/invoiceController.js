const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.settleInvoice = async (req, _) => {
  switch (req.body.type) {
    case 'InvoiceSettled':
      updateOrderPaymentStatus(req.body);
    default:
      console.log(
        `Invoice request received: ${req.body.type} - Invoice ID ${req.body.invoiceId}`,
      );
  }
  console.log(req.body);
};

function updateOrderPaymentStatus(data) {
  const { invoiceId, timestamp } = data;
  console.log(`Invoice settled: ${invoiceId} - Time: ${timestamp}`);
}
