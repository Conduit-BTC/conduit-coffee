const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.settleInvoice = async (req, _) => {
    switch (req.body.type) {
      case 'InvoicePaymentSettled':
        console.log('Invoice settled: ', req.body.invoiceId);
      default:
        console.log(
          `Invoice request received: ${req.body.type} - Invoice ID ${req.body.invoiceId}`,
        );
    }
    console.log(req.body);
};
