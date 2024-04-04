const getCurrentSatsPrice = async () => {
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
      console.log(`CoinGecko Rate: $1.00 => ${satsToUsd} Satoshis`);
      return satsToUsd;
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });
};

module.exports = getCurrentSatsPrice;
