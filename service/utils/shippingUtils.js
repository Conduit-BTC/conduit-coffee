const { getOauthToken } = require('./oauthUtils');
const { createVeeqoCustomer, createVeeqoOrder } = require('./shippingProviders/veeqo');

const { dbService } = require('../services/dbService');
const prisma = dbService.getPrismaClient();

async function createShipment(invoiceId) {
  try {
    const order = await prisma.order.findFirst({
      where: { invoiceId: invoiceId },
      include: { cart: true },
    });

    if (!order) {
      throw new Error(`Order with Invoice ID ${invoiceId} not found`);
    }
    const vCustomerId = await createVeeqoCustomer(order.id);

    if (!vCustomerId) {
      throw new Error('Error creating Veeqo customer');
    }

    const vOrderId = await createVeeqoOrder(vCustomerId, order, invoiceId);

    if (!vOrderId) {
      // Use NodeMailer to send an email to the admin
    }

    const orderShipmentUpdate = updateOrderWithShipmentInfo(order.id, vOrderId, "Veeqo");

    if (!orderShipmentUpdate) {
      throw new Error('Error updating order with shipment ID');
    }

    console.log("----- Payment Processing Pipeline COMPLETE -----");
  } catch (error) {
    console.error('Error creating shipment:', error);
    throw error;
  }
}

async function updateOrderWithShipmentInfo(orderId, shippingOrderId, shippingProvider) {
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

/**
 * Calculate shipping costs for a set of items to a zip code
 * @param {string} zip - Destination zip code
 * @param {Array} items - Cart items to be shipped
 * @returns {Promise<{ success: boolean, cost?: number, error?: { message: string, status?: number }>}}
 */
async function calculateShippingCost(zip, items) {
  const SHIPPING_DISCOUNT = 0.8;
  try {
    const packages = calculatePackagesFromCart(items);
    let totalCost = 0.0;

    // Get OAuth token
    const token = await getOauthToken();
    const bearer = token.access_token;

    // Process each package
    for (const pkg of packages) {
      const rateResponse = await fetchPackageRate(zip, pkg, bearer);

      if (!rateResponse.success) {
        return {
          success: false,
          error: rateResponse.error
        };
      }

      totalCost += rateResponse.cost;
    }

    // Apply discount and return success result
    return {
      success: true,
      cost: totalCost * SHIPPING_DISCOUNT
    };

  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Error calculating shipping cost',
        status: error.status || 500
      }
    };
  }
}

/**
 * Fetch shipping rate for a single package
 * @param {string} zip - Destination zip code
 * @param {Object} pkg - Package details
 * @param {string} bearer - OAuth bearer token
 * @returns {Promise<{ success: boolean, cost?: number, error?: { message: string, status: number }}>}
 */
async function fetchPackageRate(zip, pkg, bearer) {
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
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: {
          message: 'Issue requesting shipping cost estimation from USPS',
          status: response.status
        }
      };
    }

    const data = await response.json();
    return {
      success: true,
      cost: data.rateOptions[0].totalBasePrice
    };

  } catch (error) {
    console.error('Error fetching package rate:', error);
    return {
      success: false,
      error: {
        message: 'Error fetching package rate',
        status: error.status || 500
      }
    };
  }
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
