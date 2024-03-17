import { useRef } from "react";
import { useCartContext } from "../context/CartContext";
import pingBorder from "../lib/pingBorder";
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
        className={`mb-4 z-0 ${
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

function ProductLineItem({
  borderElement,
  name,
  number,
  type,
  pingColor,
  borderColor,
  accentColor,
  bagCount,
  increaseFunction,
  decreaseFunction,
}) {
  return (
    <div
      className="flex items-center border-2 border-[var(--secondary-bg-color)] p-2"
      ref={borderElement}
    >
      <p
        className={`border-2 rounded-sm p-1 px-3 flex items-center justify-center font-[700] ${borderColor}`}
        style={{ fontFamily: "Fira Code" }}
      >
        {bagCount}
      </p>
      <h4 className="font-[700] px-2">
        <span className={accentColor}>{name}</span>
        <span className="text-h7">{` (${type})`}</span>
      </h4>
      <div className="flex mx-2 gap-2">
        <button
          onClick={() => {
            decreaseFunction();
          }}
          className={
            "p-1 w-8 h-8 lg:w-6 lg:h-6 flex items-center justify-center rounded-sm bg-red-800" +
            (bagCount === 0 ? " opacity-50" : "")
          }
          disabled={bagCount === 0}
        >{`-`}</button>
        <button
          onClick={() => {
            pingBorder(borderElement.current, pingColor);
            increaseFunction();
          }}
          className="p-1 w-8 h-8 lg:w-6 lg:h-6 flex items-center justify-center rounded-sm bg-green-800"
        >{`+`}</button>
      </div>
    </div>
  );
}

export default BodyLayout;
