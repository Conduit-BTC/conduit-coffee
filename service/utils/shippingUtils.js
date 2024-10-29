const { getOauthToken } = require('./oauthUtils');
const { createVeeqoCustomer, createVeeqoOrder } = require('./shippingProviders/veeqo');

const { dbService } = require('../services/dbService');
const prisma = dbService.getPrismaClient();

async function createShipment(invoiceId) {
  console.log('Creating shipment for invoice ID:', invoiceId);

  try {
    const order = await prisma.order.findFirst({
      where: { invoiceId: invoiceId },
      include: { cart: true },
    });

    if (!order) {
      throw new Error(`Order with Invoice ID ${invoiceId} not found`);
    }

    console.log('Creating customer for order: ', order.id);
    const vCustomerId = await createVeeqoCustomer(order.id);

    if (!vCustomerId) {
      throw new Error('Error creating Veeqo customer');
    }

    console.log('Customer Created. Veeqo customer ID: ', vCustomerId);
    console.log('Creating Veeqo order for customer');

    const vOrderId = await createVeeqoOrder(vCustomerId, order, invoiceId);

    if (!vOrderId) {
      throw new Error('Error creating Veeqo order');
    }

    console.log('Order Created. Veeqo order ID:', vOrderId);

    const orderShipmentUpdate = updateOrderWithShipmentInfo(order.id, vOrderId, "Veeqo");

    if (!orderShipmentUpdate) {
      throw new Error('Error updating order with shipment ID');
    }

    console.log('Order updated with shipment info: ', order.id, vOrderId, 'Veeqo');
    console.log("----- Payment Processing Pipeline COMPLETE -----");
  } catch (error) {
    console.error('Error creating shipment:', error);
    throw error;
  }
}

async function updateOrderWithShipmentInfo(orderId, shippingOrderId, shippingProvider) {
  console.log('Updating order with shipment ID:', orderId, shippingOrderId, shippingProvider);
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { shippingOrderId: shippingOrderId.toString(), shippingProvider, shippingStatus: 'PROCESSING' },
  });

  if (updatedOrder?.affectedRows == 0) {
    throw new Error(`Error updating order with shipment ID: ${orderId}`);
  }

  return true;
}

function createRatesPayload(zip, pkg) {
  const originZIPCode = process.env.SHIPPING_ORIGIN_ZIP;

  const ozToLbs = (oz) => oz / 16;

  return {
    originZIPCode,
    destinationZIPCode: zip,
    weight: ozToLbs(pkg.weight),
    length: pkg.length,
    width: pkg.width,
    height: pkg.height,
    mailClasses: ['USPS_GROUND_ADVANTAGE'],
    priceType: 'CONTRACT',
  };
}

async function calculateShippingCost(zip, items) {
  const packages = calculatePackagesFromCart(items);
  let totalCost = 0.0;
  let error;
  const token = await getOauthToken();
  const bearer = token.access_token;

  for (const pkg of packages) {
    const payload = createRatesPayload(zip, pkg);
    try {
      const response = await fetch(
        'https://api.usps.com/prices/v3/total-rates/search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearer}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        const data = await response.json();
        totalCost += data.rateOptions[0].totalBasePrice;
      } else {
        console.error(
          'Issue requesting shipping cost estimation from USPS:',
          response.status,
        );
        error = {
          message: 'Issue requesting shipping cost estimation from USPS:',
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
  console.log('Total Cost: ', totalCost);
  return totalCost * 0.8;
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

module.exports = {
  calculateShippingCost,
  createShipment,
  updateOrderWithShipmentInfo,
  __test__: {
    calculatePackagesFromCart,
    calculateShippingCost,
  },
};
