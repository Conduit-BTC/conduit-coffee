const { PrismaClient } = require('@prisma/client');
const { getLocationFromZipCode } = require('./getLocationFromZipCode');

const prisma = new PrismaClient();

async function calculateShippingCost(cart) {
  const totalWeight = cart.items.reduce((acc, item) => {
    const { productId, quantity } = JSON.parse(item);
    const product = prisma.product.findUnique({
      where: { id: productId },
    });
    return acc + product.weight * quantity;
  }, 0);

  // Shipping via USPS Ground Advantage
  // 1 bag - 10.5"x8" padded envelope
  // 2-4 bags - 12x8x6 box
  // 5+ bags - a combination of the above
  // Shipstation Get Rates API used here
  return totalCost;
}

export function calculateDimensions(cart) {
  // Determine package dimensions based on the number of bags
  let packages = [];
  let index = cart.items.length - 1;

  const small = {
    units: 'inches',
    length: 10.5,
    width: 8,
    height: 1,
  };

  const large = {
    units: 'inches',
    length: 12,
    width: 8,
    height: 6,
  };

  if (index % 4 === 0) {
    const p = { ...small, weight: cart.items[index].weight };
    packages.push(p);
    index -= 1;
  }

  if (index === 0) return packages;

  let pkgQty = 0;
  let weight = 0;

  for (let i = index; i >= 0; i--) {
    if (i === 0) {
      weight += cart.items[i].weight;
      pkgQty++;
    }
    if (i === 0 || pkgQty === 4) {
      const p = { ...large, weight };
      packages.push(p);
      pkgQty = 0;
      weight = 0;
    }

    weight += cart.items[i].weight;
    pkgQty++;
  }

  return packages;
}

async function createShipStationOrder(orderId) {
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

module.exports = {
  __test__: {
    calculateDimensions,
    calculateShippingCost,
    createShipStationItems,
    createShipStationOrder,
    updateOrderShipstationId,
  },
};
