const { getStrikeInvoiceDetails } = require('../utils/invoiceUtils');
const { getOrderByInvoiceId, getCartByOrderId } = require('../utils/orderUtils');
const { dbService } = require('../services/dbService');
const EmailFormatters = require('../services/email/templates/shared/formatters');
const prisma = dbService.getPrismaClient();

async function generateReceiptDetailsObject(invoiceId) {
    const invoice = await getStrikeInvoiceDetails(invoiceId);
    const order = await getOrderByInvoiceId(invoiceId);
    const cart = await getCartByOrderId(order.id);
    const items = await formatCartForReceipt(cart.items);

    return {
        orderId: order.id,
        shippingInfo: {
            name: `${order.first_name} ${order.last_name}`,
            address: EmailFormatters.address(order),
            instructions: order.special_instructions || null,
        },
        email: (order.email || null),
        npub: (order.npub || null),
        totalCost: invoice.amount.amount * 100000000, // Convert Sats to USD
        subtotal: cart.sats_cart_price,
        shippingCost: cart.shipping_cost_sats,
        date: invoice.created,
        items
    }
}

async function formatCartForReceipt(cartItems) {
    const parsedItems = cartItems.map(item => {
        try {
            return typeof item === 'string' ? JSON.parse(item) : item;
        } catch (e) {
            console.error('Error parsing cart item:', e);
            return null;
        }
    }).filter(item => item !== null);

    // Fetch all product details in a single query
    const productIds = parsedItems.map(item => item.productId);
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds
            }
        }
    });

    const productMap = products.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
    }, {});

    return parsedItems.map(item => {
        const product = productMap[item.productId];
        if (!product) {
            console.error(`Product not found for ID: ${item.productId}`);
            return {
                quantity: item.quantity,
                weight: item.weight,
                name: 'Unknown Product',
                price: 0
            };
        }

        return {
            quantity: item.quantity,
            weight: item.weight,
            name: product.name,
            price: product.price,
            sku: product.sku
        };
    });
}

module.exports = { generateReceiptDetailsObject };
