import { useCartContext } from "../context/CartContext";
import { useCryptoContext } from "../context/CryptoContext";
import SatsIcon from "./SatsIcon";

export default function CurrentHodlings() {
  const { cartPriceUsd, totalCartQty } = useCartContext();
  const { satsToUsd } = useCryptoContext();
  return (
    <div className="text-left bg-[var(--cart-bg-color)] flex w-ful gap-4">
      <h5>
        <span
          className={
            totalCartQty == 0
              ? "text-red-500"
              : "text-[var(--secondary-text-color)]"
          }
        >
          {` ${totalCartQty} ${totalCartQty == 1 ? "Bag" : "Bags"}`}
        </span>
      </h5>
      <h5>
        <span className="text-green-500">${cartPriceUsd.toFixed(2)} USD</span>
      </h5>
      <h5>
        <span className="text-orange-500">
          <SatsIcon color="orange" />
          {((cartPriceUsd || 0) * satsToUsd).toFixed(0)} Sats
        </span>
      </h5>
    </div>
  );
}
