const { __test__ } = require('../../utils/shippingUtils');
const { calculateShippingCost } = __test__;

const items = [
  { weight: 12, quantity: 1 },
  { weight: 12, quantity: 1 },
  { weight: 12, quantity: 1 },
  { weight: 12, quantity: 3 },
  { weight: 12, quantity: 3 },
];

async function calculateCost() {
  const cost = await calculateShippingCost('90046', items);
  console.log('Total cost: ', cost);
}

calculateCost();
