const { __test__: { calculatePackagesFromCart } } = require('../../utils/shippingUtils');

describe('calculatePackagesFromCart', () => {
  const defaultPackageDetails = {
    units: 'inches',
    length: 10.5,
    width: 8,
    height: 1,
  };

  test('handles empty input array', () => {
    expect(calculatePackagesFromCart([])).toEqual([]);
  });

  test('handles undefined input', () => {
    expect(calculatePackagesFromCart()).toEqual([]);
  });

  test('handles non-array input', () => {
    expect(calculatePackagesFromCart(null)).toEqual([]);
    expect(calculatePackagesFromCart({})).toEqual([]);
  });

  test('creates one package for a single item', () => {
    const input = [{ weight: 1.5, quantity: 1 }];
    const expected = [{
      ...defaultPackageDetails,
      weight: 1.5,
      itemCount: 1
    }];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });

  test('creates one package for two items', () => {
    const input = [
      { weight: 1.5, quantity: 1 },
      { weight: 2.0, quantity: 1 }
    ];
    const expected = [{
      ...defaultPackageDetails,
      weight: 3.5,
      itemCount: 2
    }];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });

  test('creates multiple packages for more than two items', () => {
    const input = [{ weight: 1.0, quantity: 3 }];
    const expected = [
      {
        ...defaultPackageDetails,
        weight: 2.0,
        itemCount: 2
      },
      {
        ...defaultPackageDetails,
        weight: 1.0,
        itemCount: 1
      }
    ];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });

  test('handles items with zero quantity', () => {
    const input = [
      { weight: 1.5, quantity: 0 },
      { weight: 2.0, quantity: 1 }
    ];
    const expected = [{
      ...defaultPackageDetails,
      weight: 2.0,
      itemCount: 1
    }];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });

  test('handles items with missing quantity', () => {
    const input = [
      { weight: 1.5 },
      { weight: 2.0, quantity: 1 }
    ];
    const expected = [{
      ...defaultPackageDetails,
      weight: 2.0,
      itemCount: 1
    }];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });

  test('handles items with missing weight', () => {
    const input = [
      { quantity: 2 },
      { weight: 2.0, quantity: 1 }
    ];
    const expected = [
      {
        ...defaultPackageDetails,
        weight: 0,
        itemCount: 2
      },
      {
        ...defaultPackageDetails,
        weight: 2.0,
        itemCount: 1
      }
    ];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });

  test('processes complex mixed quantities correctly', () => {
    const input = [
      { weight: 1.5, quantity: 3 },
      { weight: 2.0, quantity: 2 }
    ];
    const expected = [
      {
        ...defaultPackageDetails,
        weight: 3.0,
        itemCount: 2
      },
      {
        ...defaultPackageDetails,
        weight: 3.5,
        itemCount: 2
      },
      {
        ...defaultPackageDetails,
        weight: 2.0,
        itemCount: 1
      }
    ];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });
});
