const axios = require('axios');

const fetchUsdBtcValueFromStrike = async () => {
  let config = {
    method: 'get',
    url: 'https://api.strike.me/v1/rates/ticker',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.STRIKE_API_KEY}`,
    },
  };
  return axios(config)
    .then((response) => {
      const btcToUsd = response.data.filter(
        (obj) => obj.sourceCurrency === 'USD' && obj.targetCurrency === 'BTC',
      );
      console.log('>>>>> fetchUsdBtcValueFromStrike response: ', btcToUsd);
      return btcToUsd[0].amount;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const getCurrentSatsPrice = async () => {
  try {
    const usdToBtc = await fetchUsdBtcValueFromStrike();
    const satsToUsd = usdToBtc * 100000000;
    return satsToUsd;
  } catch (error) {
    console.error(
      'There was a problem with the fetch operation: getCurrentSatsPrice()',
      error,
    );
    return null;
  }
};

module.exports = getCurrentSatsPrice;
