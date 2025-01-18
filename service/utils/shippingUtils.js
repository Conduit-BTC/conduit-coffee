const { getOauthToken } = require('./oauthUtils');
const { SHIPPING_DISCOUNT } = require('./constants');
const { dbService } = require('../services/dbService');
const { createShipStationOrder } = require('./shippingProviders/shipStation');

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

    console.log("----- Shipping Pipeline START -----");

    const shippingId = await createShipStationOrder(order);
    const success = await updateOrderWithShipmentInfo(order.id, shippingId, 'SHIPSTATION');

    if (!success) {
      throw new Error(`Error updating order with shipment ID: ${order.id}`);
    }

    console.log("----- Shipping Pipeline COMPLETE -----");
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

function calculatePackagesFromCart(_items = []) {
  // Early return for empty cart
  if (!Array.isArray(_items) || _items.length === 0) {
    return [];
  }

  // Package dimensions
  const mailerDetails = {
    units: 'inches',
    length: 10,
    width: 13,
    height: 4,
  };

  const boxDetails = {
    units: 'inches',
    length: 8,
    width: 8,
    height: 6.5,
  };

  // Flatten items array based on quantity
  const flattenedItems = _items.flatMap(item =>
    Array(item.quantity || 0).fill({ weight: item.weight ? item.weight + 2.0 : 0.0 })
  );

  // Initialize result packages array
  const packages = [];

  let remainingItems = flattenedItems.length;
  let currentIndex = 0;

  while (remainingItems > 0) {
    if (remainingItems === 1 || remainingItems === 2) {
      // Handle 1 or 2 items as a mailer
      const itemsInPackage = flattenedItems.slice(currentIndex, currentIndex + remainingItems);
      const totalWeight = itemsInPackage.reduce((sum, item) => sum + item.weight, 0);

      packages.push({
        ...mailerDetails,
        weight: totalWeight,
        itemCount: itemsInPackage.length,
      });

      remainingItems = 0;
    } else if (remainingItems === 3 || remainingItems === 4) {
      // Handle 3 or 4 items as a box
      const itemsInPackage = flattenedItems.slice(currentIndex, currentIndex + remainingItems);
      const totalWeight = itemsInPackage.reduce((sum, item) => sum + item.weight, 0);

      packages.push({
        ...boxDetails,
        weight: totalWeight,
        itemCount: itemsInPackage.length,
      });

      remainingItems = 0;
    } else {
      // Handle 5 or more items: use box first
      const itemsInPackage = flattenedItems.slice(currentIndex, currentIndex + 4);
      const totalWeight = itemsInPackage.reduce((sum, item) => sum + item.weight, 0);

      packages.push({
        ...boxDetails,
        weight: totalWeight,
        itemCount: itemsInPackage.length,
      });

      remainingItems -= 4;
      currentIndex += 4;
    }
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
