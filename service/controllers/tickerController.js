const getCurrentSatsPrice = require('../utils/getCurrentSatsPrice');

exports.sats = async (req, res) => {
  try {
    const price = await getCurrentSatsPrice();
    res.status(200).json({ price }, 200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: 'Server Error' });
  }
};
