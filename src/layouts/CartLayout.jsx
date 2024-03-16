import BitcoinPriceChart from "../components/PriceChart";
import { BASE_COST_PER_BAG } from "../constants";
import { useCryptoContext } from "../context/CryptoContext";
import { useCartContext } from "../context/CartContext";
import { useEffect } from "react";

export default function CartLayout() {
  const { satsToUsd } = useCryptoContext();
  const { lightRoastBags, darkRoastBags, cartPrice, setCartPrice, bagCount } =
    useCartContext();

  useEffect(() => {
    const newHodlings = lightRoastBags + darkRoastBags;
    setCartPrice(newHodlings * BASE_COST_PER_BAG);
  }, [lightRoastBags, darkRoastBags]);

  return (
    <section className="z-100 w-full lg:w-1/2 lg:display min-h-screen right-0 top-0 p-2 ">
      <div className="h-full p-2 bg-[var(--cart-bg-color)] text-[var(--cart-text-color)] flex flex-col gap-4">
        {/* Header */}
        <div className="w-full p-2 bg-[var(--cart-secondary-bg-color)]">
          <h2 className="text-center text-[var(--cart-header-color)]">
            My Hodlings
          </h2>
        </div>
        {/* CoinGecko Rate */}
        <div className="text-left p-2 bg-[var(--cart-bg-color)] border-4 border-[var(--cart-secondary-bg-color)]">
          <h4 className="font-[700]">Current Rate:</h4>
          <span className="text-green-500">$1.00</span> ={" "}
          <span className="text-orange-500">{satsToUsd} (Satoshis)</span>
          <h4 className="font-[700] mt-2">Price Per Bag: </h4>
          <span className="text-green-500">${BASE_COST_PER_BAG}.00</span> /{" "}
          <span className="text-orange-500">
            {`${(satsToUsd * BASE_COST_PER_BAG).toFixed(5)}`}
          </span>
          <p className="text-xs mt-2">CoinGecko Real-Time Rate</p>
        </div>
        {/* PricePerBag */}
        <div className="text-left mt-auto p-2 border-4 border-[var(--cart-secondary-bg-color)] bg-[var(--cart-bg-color)]">
          <h4>
            <span className="font-[700]">{`>> Your Hodl:`} </span>
            <span className="text-green-500">
              ${(lightRoastBags + darkRoastBags) * BASE_COST_PER_BAG}
            </span>{" "}
            /{" "}
            <span className="text-orange-500">
              {((cartPrice || 0) * satsToUsd).toFixed(5)}
            </span>
          </h4>
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
            className={`p-4 text-[var(--cart-secondary-bg-color)] font-[700] w-full bg-[var(--cart-button-color)] hover:border-4 hover:border-blue-500 transition-all ${
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

// const RoastItem = ({ name, type, qty, accentColor }) => {
//   return (
//     <div className="border-2 p-2 border-[var(--cart-secondary-bg-color)]">
//       <p>
//         <span className={`${accentColor || ""} font-bold`}>{name}</span> |{" "}
//         {type}
//       </p>
//       <p>Bags: {qty}</p>
//     </div>
//   );
// };
