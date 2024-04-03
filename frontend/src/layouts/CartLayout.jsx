import BitcoinPriceChart from "../components/PriceChart";
import { BASE_COST_PER_BAG } from "../constants";
import { useCartContext } from "../context/CartContext";
import { useUiContext } from "../context/UiContext";
import { useEffect } from "react";
import CurrentHodlings from "../components/CurrentHodlings";

export default function CartLayout() {
  const { openModal } = useUiContext();
  const { lightRoastBags, darkRoastBags, setCartPrice } = useCartContext();

  // const borderRef = useRef(null);

  useEffect(() => {
    const newHodlings = lightRoastBags + darkRoastBags;
    setCartPrice(newHodlings * BASE_COST_PER_BAG);
  }, [lightRoastBags, darkRoastBags]);

  // useEffect(() => {
  //   pingBorder(borderRef.current, "blue");
  // }, [lightRoastBags]);

  // useEffect(() => {
  //   pingBorder(borderRef.current, "red");
  // }, [darkRoastBags]);

  return (
    <section className="z-100 w-full lg:w-1/2 lg:display min-h-screen right-0 top-0 p-2 ">
      <div className="h-full p-2 bg-[var(--cart-bg-color)] text-[var(--cart-text-color)] flex flex-col gap-4">
        {/* Header */}
        <div className="w-full p-2 bg-[var(--cart-secondary-bg-color)]">
          <h2 className="text-center text-[var(--cart-header-color)]">
            My Hodlings
          </h2>
        </div>
        <div className="p-2">
          <CurrentHodlings />
        </div>
        {/* Light/Dark */}
        {/* <div className="flex flex-col gap-4">
          <RoastItem
            name="Lightn.ng"
            type="Light Roast"
            qty={lightRoastBags}
            accentColor="text-blue-500"
          />
          <RoastItem
            name="Resist.nce"
            type="Dark Roast"
            qty={darkRoastBags}
            accentColor="text-red-500"
          />
        </div> */}

        {/* Chart + Buy Now */}
        <div className="flex flex-col bg-[var(--cart-bg-color)]">
          <div className="mb-8 w-full h-full">
            <BitcoinPriceChart />
          </div>
          <button
            onClick={() => {
              openModal();
            }}
            className={`p-4 text-[var(--main-text-color)] hover:font-bold w-full bg-blue-500 ${
              lightRoastBags + darkRoastBags == 0
                ? " opacity-50"
                : "opacity-100"
            }`}
            disabled={lightRoastBags + darkRoastBags == 0}
          >
            {`step 3: zap out -> buy now`}
          </button>
        </div>
      </div>
    </section>
  );
}
