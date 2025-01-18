const { __test__: { calculatePackagesFromCart } } = require('../../utils/shippingUtils');

describe('calculatePackagesFromCart', () => {
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

  test('creates one mailer for a single item', () => {
    const input = [{ weight: 12.0, quantity: 1 }];
    const expected = [{
      ...mailerDetails,
      weight: 14.0,
      itemCount: 1
    }];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });

  test('creates one mailer for two items', () => {
    const input = [
      { weight: 12.0, quantity: 1 },
      { weight: 14.0, quantity: 1 }
    ];
    const expected = [{
      ...mailerDetails,
      weight: 30.0,
      itemCount: 2
    }];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });

  test('creates one box for three items', () => {
    const input = [{ weight: 12.0, quantity: 3 }];
    const expected = [{
      ...boxDetails,
      weight: 42.0,
      itemCount: 3
    }];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });

  test('creates multiple packages for more than four items', () => {
    const input = [{ weight: 8.0, quantity: 6 }];
    const expected = [
      {
        ...boxDetails,
        weight: 40.0,
        itemCount: 4
      },
      {
        ...mailerDetails,
        weight: 20.0,
        itemCount: 2
      }
    ];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });

  test('handles items with zero quantity', () => {
    const input = [
      { weight: 8.0, quantity: 0 },
      { weight: 8.0, quantity: 1 }
    ];
    const expected = [{
      ...mailerDetails,
      weight: 10.0,
      itemCount: 1
    }];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });

  test('handles items with missing quantity', () => {
    const input = [
      { weight: 1.5 },
      { weight: 8.0, quantity: 1 }
    ];
    const expected = [{
      ...mailerDetails,
      weight: 10.0,
      itemCount: 1
    }];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });

  test('handles items with missing weight', () => {
    const input = [
      { quantity: 2 },
      { weight: 8.0, quantity: 1 }
    ];
    const expected = [
      {
        ...boxDetails,
        weight: 10.0,
        itemCount: 3
      }
    ];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });

  test('processes complex mixed quantities correctly', () => {
    const input = [
      { weight: 8.0, quantity: 3 },
      { weight: 8.0, quantity: 2 }
    ];
    const expected = [
      {
        ...boxDetails,
        weight: 40.0,
        itemCount: 4
      },
      {
        ...mailerDetails,
        weight: 10.0,
        itemCount: 1
      }
    ];
    expect(calculatePackagesFromCart(input)).toEqual(expected);
  });
});
