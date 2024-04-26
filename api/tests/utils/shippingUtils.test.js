const cartFixtures = require('../_fixtures/cartFixtures');
const { __test__ } = require('../../utils/shippingUtils');

const { calculateDimensions } = __test__;
test('calculateDimensions', () => {
  const { cart1, cart3, cart5, cart7, cart8, cart9 } = cartFixtures;
  expect(calculateDimensions(cart1)).toEqual([
    { units: 'inches', length: 10.5, width: 8, height: 1, weight: 12 },
  ]);
  expect(calculateDimensions(cart3)).toEqual([
    { units: 'inches', length: 12, width: 8, height: 6, weight: 36 },
  ]);
  expect(calculateDimensions(cart5)).toEqual([
    { units: 'inches', length: 10.5, width: 8, height: 1, weight: 12 },
    { units: 'inches', length: 12, width: 8, height: 6, weight: 48 },
  ]);
  expect(calculateDimensions(cart7)).toEqual([
    { units: 'inches', length: 12, width: 8, height: 6, weight: 48 },
    { units: 'inches', length: 12, width: 8, height: 6, weight: 36 },
  ]);
  expect(calculateDimensions(cart8)).toEqual([
    { units: 'inches', length: 12, width: 8, height: 6, weight: 48 },
    { units: 'inches', length: 12, width: 8, height: 6, weight: 48 },
  ]);
  expect(calculateDimensions(cart9)).toEqual([
    { units: 'inches', length: 10.5, width: 8, height: 1, weight: 12 },
    { units: 'inches', length: 12, width: 8, height: 6, weight: 48 },
    { units: 'inches', length: 12, width: 8, height: 6, weight: 48 },
  ]);
});
