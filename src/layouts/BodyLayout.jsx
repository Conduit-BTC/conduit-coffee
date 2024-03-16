import { useRef } from "react";
import { useCartContext } from "../context/CartContext";
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
      <p className="mb-8 text-xl" style={{ fontFamily: "Fira Code" }}>
        <span className="font-[700]">$ conduit_coffee {`->`} </span>
        <span className="font-normal">coffee/for/the_people</span>
      </p>
      <p
        className={`mb-4 text-[var(--accent-text-color)] ${
          lightRoastBags + darkRoastBags == 0 ? " animate-pulse " : ""
        }`}
        style={{ fontFamily: "Fira Code" }}
      >
        {`> step 1: pick your beans ->`}
      </p>
      <div className="flex flex-col gap-4">
        <ProductLineItem
          borderElement={lightningRef}
          name="Lightn.ng"
          number="1"
          type="|Light Roast"
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
          type="|Dark Roast"
          pingColor="red"
          accentColor="text-red-600"
          borderColor="border-red-500"
          bagCount={darkRoastBags}
          increaseFunction={() => increaseDarkRoastBags()}
          decreaseFunction={() => decreaseDarkRoastBags()}
        />
      </div>
      <p
        className={`mt-8 animate-pulse text-[var(--secondary-text-color)] ${
          lightRoastBags + darkRoastBags == 0 ? "hidden" : "block"
        }`}
        style={{ fontFamily: "Fira Code" }}
      >
        {`> step 2: check your hodlings`}
      </p>
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
        {/* {`x $${BASE_COST_PER_BAG}.00 per bag`} */}
      </p>
      <h4 className="font-[700] pl-2">
        <span className={accentColor}>{name}</span> {type}
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
      <h3 className="pr-2 hidden lg:block">{`->`}</h3>
    </div>
  );
}

function pingBorder(element, pingColor) {
  const pingType = pingColor == "red" ? "ping-red" : "ping-blue";
  element.classList.add(pingType);
  setTimeout(function () {
    element.classList.remove(pingType);
  }, 1000);
}

export default BodyLayout;
