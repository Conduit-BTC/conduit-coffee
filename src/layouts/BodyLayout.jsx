import { BASE_COST_PER_BAG } from "../constants";
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

  return (
    <section className="my-2 mt-0 p-8 w-full bg-[var(--cart-bg-color)]">
      {/* <h3 className="mb-2 text-center text-[var(--main-text-color)]">
        {`⚡️ `}Welcome to Conduit{` ⚡️`}
      </h3> */}
      {/* <div className="h-[1px] m-4 mb-8 bg-[var(--main-text-color)] w-full" /> */}
      <p className="mb-4 text-xl" style={{ fontFamily: "Fira Code" }}>
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
          name="Lightn.ng"
          number="1"
          type="Light Roast"
          accentColor="text-blue-500"
          bagCount={lightRoastBags}
          increaseFunction={() => increaseLightRoastBags()}
          decreaseFunction={() => decreaseLightRoastBags()}
        />
        <ProductLineItem
          name="Resist.nce"
          number="2"
          type="Dark Roast"
          accentColor="text-red-600"
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
  name,
  number,
  type,
  accentColor,
  bagCount,
  increaseFunction,
  decreaseFunction,
}) {
  return (
    <div className="flex items-center">
      {/* <h3>{number}: </h3> */}
      <h4 className="font-[700] pl-2">
        <span className={accentColor}>{name}</span> | {type}
      </h4>
      <div className="flex lg:mx-2 mr-0 gap-2">
        <button
          onClick={decreaseFunction}
          className={
            "p-1 w-8 h-8 lg:w-6 lg:h-6 flex items-center justify-center rounded-sm bg-red-800" +
            (bagCount === 0 ? " opacity-50" : "")
          }
          disabled={bagCount === 0}
        >{`-`}</button>
        <button
          onClick={increaseFunction}
          className="p-1 w-8 h-8 lg:w-6 lg:h-6 flex items-center justify-center rounded-sm bg-green-800"
        >{`+`}</button>
      </div>
      <h3 className="pr-2 hidden lg:block">{`->`}</h3>
      <p
        className="border-2 rounded-sm p-1 px-3 border-[var(--secondary-text-color)] flex items-center justify-center font-[700]"
        style={{ fontFamily: "Fira Code" }}
      >
        {bagCount}
        {/* {`x $${BASE_COST_PER_BAG}.00 per bag`} */}
      </p>
    </div>
  );
}

export default BodyLayout;
