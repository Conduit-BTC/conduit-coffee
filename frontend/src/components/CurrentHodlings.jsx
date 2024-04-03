import { useCartContext } from "../context/CartContext";
import { useCryptoContext } from "../context/CryptoContext";
import { BASE_COST_PER_BAG } from "../constants";
import SatsIcon from "./SatsIcon";

export default function CurrentHodlings() {
  const { lightRoastBags, darkRoastBags, cartPrice } = useCartContext();
  const { satsToUsd } = useCryptoContext();
  return (
    <div className="text-left bg-[var(--cart-bg-color)] flex w-ful gap-4">
      <h5>
        <span
          className={
            lightRoastBags + darkRoastBags == 0
              ? "text-red-500"
              : "text-[var(--secondary-text-color)]"
          }
        >
          {` ${lightRoastBags + darkRoastBags} ${
            lightRoastBags + darkRoastBags == 1 ? "Bag" : "Bags"
          }`}
        </span>
      </h5>
      <h5>
        <span className="text-green-500">
          ${(lightRoastBags + darkRoastBags) * BASE_COST_PER_BAG} USD
        </span>
      </h5>
      <h5>
        <span className="text-orange-500">
          <SatsIcon color="orange" />
          {((cartPrice || 0) * satsToUsd).toFixed(0)} Sats
        </span>
      </h5>
    </div>
  );
}
