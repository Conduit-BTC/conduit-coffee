const { PrismaClient } = require('@prisma/client');
const { getLocationFromZipCode } = require('./getLocationFromZipCode');

async function createShipStationOrder(orderId) {
  const prisma = new PrismaClient();
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { cart: true },
    });
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    const { city, state, country } = await getLocationFromZipCode(order.zip);

    const shipStationOrder = {
      orderNumber: order.id.toString(),
      orderDate: new Date().toISOString(),
      orderStatus: 'awaiting_shipment',
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
      items: createShipStationItems(order.cart),
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

function createShipStationItems(cart) {
  const items = [];

  cart.products.forEach((p) => {
    items.push({
      lineItemKey: p.id,
      sku: p.sku,
      name: p.name,
      imageUrl: p.image_url || null,
      weight: {
        value: p.weight,
        units: 'ounces',
      },
      quantity: p.quantity,
      unitPrice: p.price,
      taxAmount: cart.tax_cost_usd,
      shippingAmount: cart.shipping_cost_usd,
    });
  });

  return items;
}

async function updateOrderShipstationId(orderId, shipstationId) {
  try {
    // Update the Order's shipstationId field using Prisma
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { shipstationId: shipstationId },
    });

    console.log('Order updated with ShipStation ID:', updatedOrder);
    return updatedOrder;
  } catch (error) {
    console.error('Error updating Order with ShipStation ID:', error);
    throw error;
  }
}

module.exports = {
  getLocationFromZipCode,
  createShipStationOrder,
  updateOrderShipstationId,
};
