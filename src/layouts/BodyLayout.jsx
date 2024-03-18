import { useRef } from "react";
import { useCartContext } from "../context/CartContext";
import ProductLineItem from "../components/ProductLineItem";
import ExchangeRateBox from "../components/ExchangeRateBox";

const BodyLayout = () => {
  const {
    lightRoastBags,
    darkRoastBags,
    increaseLightRoastBags,
    increaseDarkRoastBags,
    decreaseDarkRoastBags,
    decreaseLightRoastBags,
  } = useCartContext();

  const lightningRef = useRef(null);
  const resistanceRef = useRef(null);

  return (
    <section className="my-2 mt-0 p-8 w-full bg-[var(--cart-bg-color)]">
      <h5 className="mb-8">
        <span className="font-[700]">$ conduit_coffee {`->`} </span>
        <span className="font-normal">coffee/for/the_people</span>
      </h5>
      <ExchangeRateBox />
      <div className="mb-8" />
      <h5
        className={`mb-8 z-0 ${
          lightRoastBags + darkRoastBags == 0
            ? " animate-pulse "
            : "text-gray-800"
        }`}
      >
        {`> step 1: pick your beans ->`}
      </h5>
      <div className="flex flex-col gap-4">
        <ProductLineItem
          borderElement={lightningRef}
          name="Lightn.ng"
          number="1"
          type="Light Roast"
          pingColor="blue"
          accentColor="text-blue-500"
          borderColor="border-blue-500"
          bagCount={lightRoastBags}
          increaseFunction={() => increaseLightRoastBags()}
          decreaseFunction={() => decreaseLightRoastBags()}
        />
        <ProductLineItem
          borderElement={resistanceRef}
          name="Resist.nce"
          number="2"
          type="Dark Roast"
          pingColor="red"
          accentColor="text-red-600"
          borderColor="border-red-500"
          bagCount={darkRoastBags}
          increaseFunction={() => increaseDarkRoastBags()}
          decreaseFunction={() => decreaseDarkRoastBags()}
        />
      </div>
      <h5
        className={`mt-8 animate-pulse z-0 ${
          lightRoastBags + darkRoastBags == 0 ? "hidden" : "block"
        }`}
      >
        {`> step 2: check your hodlings`}
      </h5>
    </section>
  );
};



export default BodyLayout;
