const { calculateShippingCost } = require('../utils/shippingUtils');

exports.calculateShippingRate = async (req, res) => {
  const { zip, cart } = req.body;
  const cost = await calculateShippingCost(zip, cart);
  if (cost.message) return res.status(cost.status).error(cost.message);
  else res.status(200).json(cost);
};
