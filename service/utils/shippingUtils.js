const { PrismaClient } = require('@prisma/client');
const { getLocationFromZipCode } = require('./getLocationFromZipCode');

const prisma = new PrismaClient();

function createRatesPayload(zip, pkg) {
  return {
    carrierCode: 'stamps_com',
    serviceCode: 'usps_ground_advantage',
    packageCode: null,
    fromPostalCode: '94710',
    toCountry: 'US',
    toPostalCode: zip,
    weight: {
      value: pkg.weight,
      units: 'ounces',
    },
    dimensions: {
      units: 'inches',
      length: pkg.length,
      width: pkg.width,
      height: pkg.height,
    },
    confirmation: 'delivery',
    residential: true,
  };
}

async function calculateShippingCost(zip, items) {
  const packages = calculatePackagesFromCart(items);
  // Shipstation Get Rates API used here
  let totalCost = 0.0;
  let error;
  for (const pkg of packages) {
    const payload = createRatesPayload(zip, pkg);
    try {
      const response = await fetch(
        'https://ssapi.shipstation.com/shipments/getrates',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(
              `${process.env.SHIPSTATION_API_KEY}:${process.env.SHIPSTATION_API_SECRET}`,
            ).toString('base64')}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        const data = await response.json();
        totalCost += data[0].shipmentCost;
      } else {
        console.error(
          'Issue requesting shipping cost estimation from ShipStation:',
          response.status,
        );
        error = {
          message:
            'Issue requesting shipping cost estimation from ShipStation:',
          status: response.status,
        };
      }
    } catch (error) {
      console.error('Error calculating shipping cost:', error);
      error = {
        message: 'Error calculating shipping cost',
        status: response.status,
      };
    }
  }
  if (error) {
    throw error;
  }
  return totalCost;
}

function calculatePackagesFromCart(_items) {
  // Determine package dimensions based on the number of bags
  let packages = [];
  let items = [];

  for (item of _items) {
    for (let i = 0; i < item.quantity; i++) {
      items.push({ weight: item.weight });
    }
  }

  let index = items.length - 1;

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
    const p = { ...small, weight: items[index].weight };
    packages.push(p);
    index -= 1;
  }

  if (index === 0) return packages;

  let pkgQty = 0;
  let weight = 0;

  for (let i = index; i >= 0; i--) {
    if (i === 0) {
      weight += items[i].weight;
      pkgQty++;
    }
    if (i === 0 || pkgQty === 4) {
      const p = { ...large, weight };
      packages.push(p);
      pkgQty = 0;
      weight = 0;
    }

    weight += items[i].weight;
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

    console.log('NODE_ENV: ', process.env.NODE_ENV);

    const shipStationOrder = {
      orderNumber: order.id.toString(),
      orderDate: new Date().toISOString(),
      orderStatus:
        process.env.NODE_ENV === 'production'
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

module.exports = {
  calculateShippingCost,
  createShipStationOrder,
  updateOrderShipstationId,
  __test__: {
    calculatePackagesFromCart,
    calculateShippingCost,
    createShipStationItems,
    createShipStationOrder,
    updateOrderShipstationId,
  },
};
