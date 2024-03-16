import { create } from "zustand";

export const useCryptoContext = create((set) => ({
  isLooping: false,
  satsToUsd: "---",
  priceOverTime: [],

  setSatsPrice: (price) => {
    console.log("Running...");
    set((state) => ({
      satsToUsd: price,
      priceOverTime:
        price == state.priceOverTime[state.priceOverTime.length - 1]
          ? [...state.priceOverTime]
          : [...state.priceOverTime, [Date.now(), price]],
    }));
  },

  initPriceOverTime: (priceArray) =>
    set({
      priceOverTime: priceArray || [],
    }),

  startLooping: () => set(() => ({ isLooping: true })),
}));

function getTodaysDate() {
  const today = new Date();

  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = today.getFullYear();

  return dd + "-" + mm + "-" + yyyy;
}

export async function getHistoricSatsRate() {
  console.log("get today's date", getTodaysDate());
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

export async function getSatsRate() {
  return fetch(
    `https://btcpay0.voltageapp.io/api/rates?storeId=enevfPMDK4coPh5yps6T8Z55qWMSYPesffazn95Lduz`
  )
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
      const calculatedPrice = satsToUsd;
      return calculatedPrice;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
