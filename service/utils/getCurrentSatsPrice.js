const getCurrentSatsPrice = async () => {
    const storeId = process.env.BTCPAY_STORE_ID;
    if (!storeId) {
      console.error('Environment Variable missing: BTCPAY_STORE_ID');
      return;
    }
  return fetch(
    `https://btcpay0.voltageapp.io/api/rates?storeId=enevfPMDK4coPh5yps6T8Z55qWMSYPesffazn95Lduz`,
  )
    .then((response) => {
      if (!response.ok) {
        console.error(response);
        throw new Error(response.message || '');
      }
      return response.json();
    })
    .then((data) => {
      const btcToUsd = data[0].rate;
      const usdToBtc = 1 / btcToUsd;
      const satsToUsd = usdToBtc * 100000000;
      return satsToUsd;
    })
    .catch((error) => {
      console.error(
        'There was a problem with the fetch operation: getCurrentSatsPrice()',
        error,
      );
    });
};

module.exports = getCurrentSatsPrice;
