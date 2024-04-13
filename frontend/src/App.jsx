import React from "react";
import "./App.css";
import HeaderLayout from "./layouts/HeaderLayout";
import TerminalLayout from "./layouts/TerminalLayout";
import FooterLayout from "./layouts/FooterLayout";
import CartLayout from "./layouts/CartLayout";
import "@fontsource/fira-code/400.css";
import "@fontsource/fira-code/700.css";
import "@fontsource/fira-sans";
import { useCryptoContext } from "./context/CryptoContext";
import { getHistoricSatsPrice } from "./lib/cryptoApiFunctions";
import { useCartContext } from "./context/CartContext";
import { SATS_REFRESH_RATE } from "./constants";
import ModalWindowLayout from "./layouts/ModalWindowLayout";
import CheckoutLayout from "./layouts/CheckoutLayout";

// Sets the global price via context, with the help of the app's useEffect()
async function updateCryptoContext(
  startLooping,
  setSatsPrice,
  setSatsPriceOverTime
) {
  const execute = async () => {
    const history = await getHistoricSatsPrice();
    if (!history) return;

    const priceOverTime = history.prices.map((item) => {
      const btcToUsd = item[1];
      const usdToBtc = 1 / btcToUsd;
      const satsToUsd = usdToBtc * 100000000;
      return [item[0], satsToUsd];
    });

    const currentPrice = priceOverTime[priceOverTime.length - 1][1];

    // const currentBtcPrice = 1 / history.prices[history.prices.length - 1][1];
    // const currentPrice = currentBtcPrice * 100000000;

    if (currentPrice) setSatsPrice(currentPrice);

    setSatsPriceOverTime(priceOverTime);
  };

  execute();

  const interval = setInterval(async () => {
    execute();
  }, SATS_REFRESH_RATE);

  startLooping();

  return interval;
}

function App() {
  const { lightRoastBags, darkRoastBags } = useCartContext();
  const { isLooping, startLooping, setSatsPrice, setSatsPriceOverTime } =
    useCryptoContext();

  React.useEffect(() => {
    var interval = null;

    if (!isLooping) {
      interval = updateCryptoContext(
        () => startLooping(),
        (p) => setSatsPrice(p),
        (a) => setSatsPriceOverTime(a)
      );
    }

    return () => {
      if (interval) clearTimeout(interval);
    };
  }, [lightRoastBags, darkRoastBags]);

  return (
    <main className="p-2 bg-[var(--secondary-bg-color)] min-h-screen">
      <section className="relative bg-[var( bg-[var(--secondary-bg-color)])] flex flex-col justify-start w-full h-full border-4 border-[var(--main-text-color)] min-h-[97.5vh]">
        <ModalWindowLayout>
          <CheckoutLayout />
        </ModalWindowLayout>
        {/* <HeaderLayout /> */}
        <div className="flex flex-col lg:flex-row justify-between">
          <TerminalLayout />
          <CartLayout />
        </div>
        <FooterLayout />
      </section>
    </main>
  );
}

export default App;
