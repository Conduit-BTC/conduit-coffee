const { PrismaClient } = require('@prisma/client');

async function getCityStateFromZipCode(zipCode) {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);

    if (!response.ok) {
      throw new Error(`Error fetching city and state: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.places && data.places.length > 0) {
      const country = data['country abbreviation'];
      const { 'place name': city, 'state abbreviation': state } =
        data.places[0];
      const trimmedState = typeof state === 'string' ? state.trim() : state;
      return { city, state: trimmedState, country };
    } else {
      throw new Error(`No data found for zip code: ${zipCode}`);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

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
    const { city, state, country } = await getCityStateFromZipCode(order.zip);

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

    console.table(shipStationOrder);

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
    console.log('ShipStation order created:', data);
    return data.orderId;
  } catch (error) {
    console.error('Error creating ShipStation order:', error);
    throw error;
  }
}

function createShipStationItems(cart) {
  const items = [];

  if (cart.light_roast > 0) {
    items.push({
      lineItemKey: 'light_roast',
      sku: 'LIGHT_ROAST',
      name: 'Light Roast Coffee',
      imageUrl: null,
      weight: {
        value: 12,
        units: 'ounces',
      },
      quantity: cart.light_roast,
      unitPrice: 20.0,
      taxAmount: 0,
      shippingAmount: 5.0,
    });
  }

  if (cart.dark_roast > 0) {
    items.push({
      lineItemKey: 'dark_roast',
      sku: 'DARK_ROAST',
      name: 'Dark Roast Coffee',
      imageUrl: null,
      weight: {
        value: 12,
        units: 'ounces',
      },
      quantity: cart.dark_roast,
      unitPrice: 20.0,
      taxAmount: 0,
      shippingAmount: 5.0,
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

    console.log('Order updated with ShipStation ID:', updatedOrder);
    return updatedOrder;
  } catch (error) {
    console.error('Error updating Order with ShipStation ID:', error);
    throw error;
  }
}

module.exports = {
  getCityStateFromZipCode,
  createShipStationOrder,
  updateOrderShipstationId,
};
