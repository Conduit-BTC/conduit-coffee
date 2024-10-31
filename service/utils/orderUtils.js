const { InvoiceStatus } = require('../utils/invoiceUtils');
const { dbService } = require('../services/dbService');
const prisma = dbService.getPrismaClient();

/**
 * Retrieves an order by its invoice ID.
 *
 * @param {string} invoiceId - The invoice ID to search for
 * @returns {Promise<Object|null>} The order if found, null if not found
 * @throws {Error} If the invoice ID is invalid or if there's a database error
 */
async function getOrderByInvoiceId(invoiceId) {
    try {
        if (!invoiceId || typeof invoiceId !== 'string') {
            throw new Error('Invalid invoice ID: must be a non-empty string');
        }

        const sanitizedInvoiceId = invoiceId.trim();

        const order = await prisma.order.findFirst({
            where: {
                invoiceId: sanitizedInvoiceId
            }
        });

        return order;

    } catch (error) {
        throw new Error(`Failed to fetch order: ${error.message}`);
    }
}

/**
 * Retrieves cart details by order ID, including all cart fields.
 *
 * @param {string} orderId - The order ID to search for
 * @returns {Promise<Object|null>} The cart if found, null if not found
 * @throws {Error} If the order ID is invalid or if there's a database error
 */
async function getCartByOrderId(orderId) {
    try {
        // Basic input validation
        if (!orderId || typeof orderId !== 'string') {
            throw new Error('Invalid order ID: must be a non-empty string');
        }

        const cart = await prisma.cart.findUnique({
            where: {
                orderId: orderId.trim()
            },
            select: {
                id: true,
                sats_cart_price: true,
                usd_cart_price: true,
                shipping_cost_usd: true,
                shipping_cost_sats: true,
                items: true,
                orderId: true
            }
        });

        return cart;

    } catch (error) {
        throw new Error(`Failed to fetch cart: ${error.message}`);
    }
}

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

module.exports = { updateOrderInvoiceStatusToPaid, getOrderByInvoiceId, getCartByOrderId };
