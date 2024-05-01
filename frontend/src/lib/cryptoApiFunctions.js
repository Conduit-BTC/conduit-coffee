export async function getCurrentSatsPrice() {
  const storeId = import.meta.env.VITE_BTCPAY_STORE_ID;
  if (!storeId) {
    console.error("Environment Variable missing: VITE_BTCPAY_STORE_ID");
    return;
  }
  return fetch(`https://btcpay0.voltageapp.io/api/rates?storeId=${storeId}`)
    .then((response) => {
      if (!response.ok) {
        console.error(response);
        throw new Error(response.message || "");
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
      console.error("There was a problem with the fetch operation:", error);
    });
}

export async function getHistoricSatsPrice() {
  // Returns an array of arrays, each containing a timestamp and a price
  // [time, price]

  return fetch(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&precision=10`
  )
    .then((response) => {
      if (!response.ok) {
        console.error(response);
        throw new Error(response.message || "");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
