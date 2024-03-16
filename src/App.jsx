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
import { SATS_REFRESH_RATE } from "./constants";

// Sets the global price via context, with the help of the app's useEffect()
async function setPrice(startLooping, setSatsPrice, initPriceOverTime) {
  startLooping();
  const history = await getHistoricSatsRate();
  initPriceOverTime(history || []);

  const price = await getSatsRate();
  if (price) setSatsPrice(price);
  const interval = setInterval(async () => {
    const price = await getSatsRate();
    if (price) setSatsPrice(price);
  }, SATS_REFRESH_RATE);
  return interval;
}

function App() {
  const { isLooping, startLooping, setSatsPrice, initPriceOverTime } =
    useCryptoContext();

  console.log;

  React.useEffect(() => {
    // Set the global Satoshi rate
    var interval = null;
    if (!isLooping) {
      interval = setPrice(
        () => startLooping(),
        (p) => setSatsPrice(p),
        () => initPriceOverTime()
      );
    }
    return () => {
      if (interval) clearTimeout(interval);
    };
  }, []);

  return (
    <main className="p-2 bg-[var(--secondary-bg-color)] h-screen">
      <section className="bg-[var(--main-bg-color)] flex flex-col justify-start w-full h-full border-4 border-[var(--main-text-color)]">
        <CartLayout />
        <HeaderLayout />
        <BodyLayout />
        <FooterLayout />
      </section>
    </main>
  );
}

export default App;
