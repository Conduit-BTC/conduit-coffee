import { create } from "zustand";

export const useCryptoContext = create((set) => ({
  isLooping: false,
  satsPrice: "---",

  setSatsPrice: (price) => set({ satsPrice: price }),

  startLooping: () => set(() => ({ isLooping: true })),
}));

export async function getSatsPrice(price) {
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
      console.log(
        `CoinGecko Rate: $20 => ${parseInt(20.0 * satsToUsd)} Satoshis`
      );
      const calculatedPrice = parseInt(satsToUsd * price);
      return calculatedPrice;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
