const { calculateShippingCost } = require('../utils/shippingUtils');

exports.calculateShippingRate = async (req, res) => {
  const { address, cart } = req.body;
  const cost = calculateShippingCost(cart);
  res.json(rates);
};
