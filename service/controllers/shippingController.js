const { calculateShippingCost } = require('../utils/shippingUtils');

exports.calculateShippingRate = async (req, res) => {
  try {
    const { zip, cart } = req.body;
    const shippingRateResult = await calculateShippingCost(zip, cart);
    if (!shippingRateResult.success) {
      return res.status(400).json({ message: 'Shipping Rate Calculation Failed' });
    }
    return res.status(200).error(shippingRateResult);
  } catch (e) {
    res.status(500).json({ message: 'Shipping Calculator Failed' });
  }
};
