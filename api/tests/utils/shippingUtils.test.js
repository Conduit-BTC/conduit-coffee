const cartFixtures = require('../_fixtures/cartFixtures');
const { __test__ } = require('../../utils/shippingUtils');

const { calculatePackagesFromCart, calculateShippingCost } = __test__;
test('calculatePackagesFromCart', () => {
  const { cart1, cart3, cart5, cart7, cart8, cart9 } = cartFixtures;
  expect(calculatePackagesFromCart(cart1)).toEqual([
    { units: 'inches', length: 10.5, width: 8, height: 1, weight: 12 },
  ]);
  expect(calculatePackagesFromCart(cart3)).toEqual([
    { units: 'inches', length: 12, width: 8, height: 6, weight: 36 },
  ]);
  expect(calculatePackagesFromCart(cart5)).toEqual([
    { units: 'inches', length: 10.5, width: 8, height: 1, weight: 12 },
    { units: 'inches', length: 12, width: 8, height: 6, weight: 48 },
  ]);
  expect(calculatePackagesFromCart(cart7)).toEqual([
    { units: 'inches', length: 12, width: 8, height: 6, weight: 48 },
    { units: 'inches', length: 12, width: 8, height: 6, weight: 36 },
  ]);
  expect(calculatePackagesFromCart(cart8)).toEqual([
    { units: 'inches', length: 12, width: 8, height: 6, weight: 48 },
    { units: 'inches', length: 12, width: 8, height: 6, weight: 48 },
  ]);
  expect(calculatePackagesFromCart(cart9)).toEqual([
    { units: 'inches', length: 10.5, width: 8, height: 1, weight: 12 },
    { units: 'inches', length: 12, width: 8, height: 6, weight: 48 },
    { units: 'inches', length: 12, width: 8, height: 6, weight: 48 },
  ]);
});
