import React from "react";
import "./App.css";
import HeaderLayout from "./layouts/HeaderLayout";
import BodyLayout from "./layouts/BodyLayout";
import FooterLayout from "./layouts/FooterLayout";
import CartLayout from "./layouts/CartLayout";
import "@fontsource/fira-code/400.css";
import "@fontsource/fira-code/700.css";
import "@fontsource/fira-sans";
import { getSatsPrice, useCryptoContext } from "./context/CryptoContext";

async function setPrice(startLooping, setSatsPrice) {
  startLooping();
  const price = await getSatsPrice(20.0);
  setSatsPrice(price.toString());
  const interval = setInterval(async () => {
    const price = await getSatsPrice(20.0);
    setSatsPrice(price.toString());
  }, 30000);
  return interval;
}

function App() {
  const { isLooping, startLooping, setSatsPrice } = useCryptoContext();

  React.useEffect(() => {
    var interval = null;
    if (!isLooping) {
      interval = setPrice(
        () => startLooping(),
        (p) => setSatsPrice(p)
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
