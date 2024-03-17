import React from "react";
import "./App.css";
import HeaderLayout from "./layouts/HeaderLayout";
import BodyLayout from "./layouts/BodyLayout";
import FooterLayout from "./layouts/FooterLayout";
import CartLayout from "./layouts/CartLayout";
import "@fontsource/fira-code/400.css";
import "@fontsource/fira-code/700.css";
import "@fontsource/fira-sans";
import {
  getHistoricSatsRate,
  getSatsRate,
  useCryptoContext,
} from "./context/CryptoContext";
import { useCartContext } from "./context/CartContext";
import { SATS_REFRESH_RATE, BASE_COST_PER_BAG } from "./constants";

// Sets the global price via context, with the help of the app's useEffect()
async function getPrice(startLooping, setSatsPrice) {
  startLooping();
  const price = await getSatsRate();
  if (price) setSatsPrice(price);
  const interval = setInterval(async () => {
    const price = await getSatsRate();
    if (price) setSatsPrice(price);
  }, SATS_REFRESH_RATE);
  return interval;
}

async function setPrice(hodlings, setCartPriceOverTime) {
  const history = await getHistoricSatsRate();
  const prices = history.prices.slice(
    history.prices.length - 100,
    history.prices.length + 1
  );
  const newData = prices.map((p) => {
    const btcToUsd = p[1];
    const usdToBtc = 1 / btcToUsd;
    const satsToUsd = usdToBtc * 100000000;
    const costPerBag = satsToUsd * BASE_COST_PER_BAG;
    const totalCost = costPerBag * hodlings;
    return [p[0], totalCost];
  });
  setCartPriceOverTime(newData);
}

function App() {
  const { isLooping, startLooping, satsPrice, setSatsPrice } =
    useCryptoContext();
  const { lightRoastBags, darkRoastBags, setCartPriceOverTime } =
    useCartContext();

  React.useEffect(() => {
    const hodlings = lightRoastBags + darkRoastBags;
    // Set the global Satoshi rate
    var interval = null;
    if (!isLooping) {
      interval = getPrice(
        () => startLooping(),
        (p) => setSatsPrice(p)
      );
    }
    setPrice(
      hodlings,
      () => startLooping(),
      (p) => setCartPriceOverTime(p)
    );
    return () => {
      if (interval) clearTimeout(interval);
    };
  }, [lightRoastBags, darkRoastBags, satsPrice]);

  return (
    <main className="p-2 bg-[var(--secondary-bg-color)] min-h-screen">
      <section className="relative bg-[var( bg-[var(--secondary-bg-color)])] flex flex-col justify-start w-full h-full border-4 border-[var(--main-text-color)] min-h-[97.5vh]">
        <HeaderLayout />
        <div className="flex flex-col lg:flex-row justify-between">
          <BodyLayout />
          <CartLayout />
        </div>
        <FooterLayout />
      </section>
    </main>
  );
}

export default App;
