const { __test__ } = require('../../utils/shippingUtils');
const { calculateShippingCost } = __test__;
const {
  cart1,
  cart3,
  cart5,
  cart7,
  cart8,
  cart9,
} = require('../_fixtures/cartFixtures');

async function calculateCost() {
  const cost = await calculateShippingCost('90046', cart7);
  console.log('Total cost: ', cost);
}

calculateCost();
