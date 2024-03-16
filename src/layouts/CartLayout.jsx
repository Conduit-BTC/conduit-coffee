import BitcoinPriceChart from "../components/PriceChart";
import { BASE_COST_PER_BAG } from "../constants";
import { useCryptoContext } from "../context/CryptoContext";
import { useCartContext } from "../context/CartContext";

export default function CartLayout() {
  const { satsToUsd } = useCryptoContext();
  const { lightRoastBags, darkRoastBags } = useCartContext();

  return (
    <section className="z-100 w-full lg:w-1/2 lg:display min-h-screen right-0 top-0 p-2">
      <div className="h-full p-2 bg-[var(--cart-bg-color)] text-[var(--cart-text-color)] flex flex-col gap-4">
        {/* Header */}
        <div className="w-full p-2 bg-[var(--cart-secondary-bg-color)]">
          <h2 className="text-center text-[var(--cart-header-color)]">
            My Hodlings
          </h2>
        </div>
        {/* CoinGecko Rate */}
        <div className="text-center p-2 border-4 border-[var(--cart-secondary-bg-color)]">
          <span className="text-green-500">$1.00</span> ={" "}
          <span className="text-orange-500">{satsToUsd} Satoshis</span>
          <p className="text-xs ml-2">CoinGecko Real-Time Rate</p>
        </div>
        {/* PricePerBag */}
        <h4>
          Price Per Bag: <span className="text-green-500">$20.00</span> /{" "}
          <span className="text-orange-500">{`${
            satsToUsd * BASE_COST_PER_BAG
          } Satoshis`}</span>
        </h4>
        {/* Light/Dark */}
        <div className="flex flex-col gap-4">
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
        </div>
        {/* Chart + Buy Now */}
        <div className="mt-auto flex flex-col">
          <div className="mb-8 w-full h-full border-2 border-[var(--cart-secondary-bg-color)]">
            Chart
            <BitcoinPriceChart />
          </div>
          <button className="p-2 border-2 border-[var(--cart-secondary-bg-color)] self-end bg-[var(--cart-button-color)]">
            Lock-In Your Price - Buy Now
          </button>
        </div>
      </div>
    </section>
  );
}

const RoastItem = ({ name, type, qty, accentColor }) => {
  return (
    <div className="border-2 p-2 border-[var(--cart-secondary-bg-color)]">
      <p>
        <span className={`${accentColor || ""} font-bold`}>{name}</span> |{" "}
        {type}
      </p>
      <p>Bags: {qty}</p>
    </div>
  );
};
