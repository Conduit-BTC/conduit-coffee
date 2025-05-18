export async function getCurrentSatsPrice() {
  const url = import.meta.env.VITE_API_URL;

  if (!url) {
    console.error(
      "useProducts.js: Environment Variable missing: VITE_API_URL"
    );
    return;
  }

  return fetch(`${url}/ticker/sats`)
    .then((response) => {
      if (!response.ok) {
        console.error(response);
        throw new Error(response.message || "");
      }
      return response.json();
    })
    .then((data) => {
      return data.price;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

export async function getHistoricSatsPrice() {
  // Returns an array of arrays, each containing a timestamp and a price
  // [time, price]

  return fetch(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&precision=10`, {
    headers: {
      'x-cg-demo-api-key': 'CG-Demo-API-Key'
    }
  }
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
