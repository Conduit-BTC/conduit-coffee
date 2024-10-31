// Veeqo is fun...
// 1. Create a Customer
// 2. Create an Order
// 3. Create a Shipment

const { getLocationFromZipCode } = require('../getLocationFromZipCode');
const { dbService } = require('../../services/dbService');
const prisma = dbService.getPrismaClient();

async function createVeeqoCustomer(orderId, email = null) {
    try {
        const customer = await fetch(`${process.env.VEEQO_API_BASE_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.VEEQO_API_KEY,
            },
            body: JSON.stringify({
                email: email ? email : `orderId+${orderId}@customers.conduit.coffee`
            })
        });

        if (!customer.ok) {
            throw new Error(
                `Error POSTing to Veeqo - Veeqo Response: ${customer.status} - ${customer.statusText}`,
            );
        }

        const data = await customer.json();
        return data.id;
    } catch (error) {
        console.error('Error creating Veeqo customer:', error)
        return null
    }
}

async function createVeeqoOrder(customerId, order, invoiceId) {
    try {
        const { first_name, last_name, address1, address2, zip, cart } = order;
        const { city, state, country } = await getLocationFromZipCode(zip);

        const body = JSON.stringify({
            order: {
                channel_id: Number(process.env.VEEQO_CHANNEL_ID),
                customer_id: Number(customerId),
                delivery_method_id: Number(process.env.VEEQO_DELIVERY_METHOD_ID),
                deliver_to_attributes: {
                    first_name,
                    last_name,
                    address1,
                    city,
                    state,
                    country,
                    zip,
                },
                line_items_attributes: await createLineItems(cart),
                payment_attributes: {
                    "payment_type": "lightning",
                    "reference_number": `Strike Invoice ID: ${invoiceId} - Conduit Order Number: ${order.id}`
                }
            }
        })

        console.log("Posting order to Veeqo:");
        console.log("URL: ", `${process.env.VEEQO_API_BASE_URL}/orders`);
        console.log("Body: ", body);
        console.log("Headers: ", JSON.stringify({
            'Content-Type': 'application/json',
            'x-api-key': "REDACTED",
        }));

        const vOrder = await fetch(`${process.env.VEEQO_API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.VEEQO_API_KEY,
            },
            body
        });

        if (!vOrder.ok) {
            const errorResponse = await vOrder.json();
            console.error(
                `Error POSTing to ${process.env.VEEQO_API_BASE_URL}/orders - Veeqo Response: - ${vOrder.statusText} - ${vOrder.status} - ${JSON.stringify(errorResponse)}`,
            );
            return null;
        }

        const vOrderJson = await vOrder.json();

        return vOrderJson.id;
    } catch (error) {
        console.error('Error creating Veeqo order:', error);
        return null;
    }
}

async function createVeeqoShipment(orderId) {
    try {
        const body = JSON.stringify({
            carrier_id: 0,
            notify_customer: false,
            update_remote_order: false,
            allocation_id: 1,
            order_id: orderId
        })

        const shipment = await fetch(`${process.env.VEEQO_API_BASE_URL}/shipments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.VEEQO_API_KEY,
            },
            body
        })

        if (!shipment.ok) {
            throw new Error(
                `Error POSTing to Veeqo - Veeqo Response: ${shipment.status} - ${shipment.statusText}`,
            );
        }

        const data = await shipment.json();
        return data.id;
    } catch (error) {
        throw new Error('Error creating Veeqo shipment:', error);
    }
}

async function createLineItems(cart) {
    try {
        const items = [];
        for (const item of cart.items) {
            const { productId, quantity } = JSON.parse(item);
            const product = await prisma.product.findUnique({
                where: {
                    id: productId,
                },
            });
            if (!product) {
                throw new Error(`Product with ID ${productId} not found`);
            }
            if (!product.veeqoProductId) {
                throw new Error(`Veeqo Product ID not found for product with ID ${productId}`);
            }
            if (typeof product.price === 'undefined') {
                throw new Error(`Price not found for product with ID ${productId}`);
            }
            items.push({
                sellable_id: product.veeqoProductId,
                quantity: quantity,
                price_per_unit: product.price
            });
        }
        return items;
    } catch (error) {
        console.error('Error in createLineItems:', error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

module.exports = {
    createVeeqoCustomer,
    createVeeqoOrder,
    createVeeqoShipment
}
