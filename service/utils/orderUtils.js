const { InvoiceStatus } = require('../utils/invoiceUtils');
const { dbService } = require('../services/dbService');
const prisma = dbService.getPrismaClient();

async function updateOrderInvoiceStatusToPaid(invoiceId) {
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
            invoiceStatus: InvoiceStatus.PAID,
        },
    });

    if (updatedOrder?.affectedRows == 0) return false;
    return true;
}

module.exports = { updateOrderInvoiceStatusToPaid };
