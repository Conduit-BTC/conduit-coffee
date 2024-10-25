import { useEffect, useState } from "react";
import { useCartContext } from "../context/CartContext";
import { useCryptoContext } from "../context/CryptoContext";
import SatsIcon from "./SatsIcon";
import { SATS_LOADING_STRING } from "../constants";

export default function CurrentHodlingsSidebar() {
  const { cartPriceUsd, totalCartQty, cartItems } = useCartContext();
  const { satsToUsd } = useCryptoContext();
  const [finalPriceSats, setFinalPriceSats] = useState(0.0);

  useEffect(() => {
    setFinalPriceSats((cartPriceUsd * satsToUsd).toFixed(0))
  }, [cartPriceUsd, satsToUsd])

  return (
    <div className="text-left bg-[var(--cart-bg-color)] flex w-full flex-col gap-4">
      {cartItems.map((item) => (
        <div key={item.id}>
          <div className="w-full h-[2px] bg-gray-600" />
          <div className="flex w-full gap-2">
            <p className="text-[var(--secondary-text-color)]">
              {`${item.name}`}
            </p>
            <p>{` | ${item.quantity} ${
              item.quantity == 1 ? "Bag" : "Bags"
            }`}</p>
          </div>
          <div className="flex gap-4">
            <span className="text-orange-500">
              <SatsIcon color="orange" />
              {(item.price * item.quantity * satsToUsd).toFixed(0)} Sats
            </span>
            <p className="text-green-500">
              (${item.price * item.quantity} USD)
            </p>
          </div>
          <div className="w-full h-[2px] bg-gray-600" />
        </div>
      ))}
      <div className="mt-4 flex justify-center w-full gap-6">
        <h4
          className={`${
            totalCartQty == 0
              ? "text-red-500"
              : "text-[var(--primary-text-color)]"
          }`}
        >
          {`${totalCartQty} ${totalCartQty == 1 ? "Bag" : "Bags"}`}
        </h4>
        <h4>
          <span className="text-green-500">{`$${cartPriceUsd}`}</span>
        </h4>
        <h4>
          <span className="text-orange-500">
            <SatsIcon width="w-[24px]" height="h-[24px]" color="orange" />
            {`${finalPriceSats > 0 ? finalPriceSats : SATS_LOADING_STRING}`}
          </span>
        </h4>
      </div>
    </div>
  );
}
