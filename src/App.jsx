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
async function setPrice(
  hodlings,
  startLooping,
  setSatsPrice,
  setCartPriceOverTime
) {
  startLooping();
  const history = await getHistoricSatsRate();
  console.log("History:", history);
  const newData = history.prices.slice(
    history.prices.length - 100,
    history.prices.length
  );
  console.log("New History:", newData);
  setCartPriceOverTime(newData);
  // console.log("History:", history.prices);
  // const newData = history.prices.map((p) => {
  //   if (!p) return;
  //   return {
  //     x: p.x,
  //     y: p.y * hodlings * BASE_COST_PER_BAG,
  //   };
  // });
  // console.log("New Data:", newData);
  // setCartPriceOverTime(newData);

  const price = await getSatsRate();
  if (price) setSatsPrice(price);
  const interval = setInterval(async () => {
    const price = await getSatsRate();
    if (price) setSatsPrice(price);
  }, SATS_REFRESH_RATE);
  return interval;
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
      interval = setPrice(
        hodlings,
        () => startLooping(),
        (p) => setSatsPrice(p),
        (p) => setCartPriceOverTime(p)
      );
    }
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
