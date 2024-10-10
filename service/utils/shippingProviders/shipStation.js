async function createShipStationOrder(order) {
    try {
        const { city, state, country } = await getLocationFromZipCode(order.zip);

        const shipStationOrder = {
            orderNumber: order.id.toString(),
            orderDate: new Date().toISOString(),
            orderStatus:
                process.env.APP_ENV === 'production'
                    ? 'awaiting_shipment'
                    : 'cancelled',
            billTo: {
                name: `${order.first_name} ${order.last_name}`,
                company: null,
                street1: order.address1,
                street2: order.address2 || null,
                city,
                state,
                postalCode: order.zip,
                country: country,
                phone: null,
                residential: true,
            },
            shipTo: {
                name: `${order.first_name} ${order.last_name}`,
                company: null,
                street1: order.address1,
                street2: order.address2 || null,
                city,
                state,
                postalCode: order.zip,
                country: country,
                phone: null,
                residential: true,
            },
            items: await createShipStationItems(order.cart),
        };

        const response = await fetch(
            'https://ssapi.shipstation.com/orders/createorder',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${Buffer.from(
                        `${process.env.SHIPSTATION_API_KEY}:${process.env.SHIPSTATION_API_SECRET}`,
                    ).toString('base64')}`,
                },
                body: JSON.stringify(shipStationOrder),
            },
        );

        if (!response.ok) {
            throw new Error(
                `Error POSTing to ShipStation - ShipStation Response: ${response.status} - ${response.statusText}`,
            );
        }

        const data = await response.json();
        return data.orderId;
    } catch (error) {
        console.error('Error creating ShipStation order:', error);
        throw error;
    }
}

async function createShipStationItems(cart) {
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

        items.push({
            lineItemKey: product.id,
            sku: product.sku,
            name: product.name,
            imageUrl: product.image_url || null,
            weight: {
                value: product.weight,
                units: 'ounces',
            },
            quantity: quantity,
            unitPrice: product.price,
            shippingAmount: cart.shipping_cost_usd,
        });
    }

    return items;
}

async function updateOrderShipstationId(orderId, shipstationId) {
    try {
        // Update the Order's shipstationId field using Prisma
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { shipstationId: shipstationId },
        });
        return updatedOrder;
    } catch (error) {
        console.error('Error updating Order with ShipStation ID:', error);
        throw error;
    }
}
