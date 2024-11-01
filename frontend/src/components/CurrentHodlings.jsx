// CurrentHodlings.jsx
import { useState, useEffect } from "react";
import { useCartContext } from "../context/CartContext";
import { useCryptoContext } from "../context/CryptoContext";
import SatsIcon from "./SatsIcon";
import { SATS_LOADING_STRING } from "../constants";

export default function CurrentHodlings() {
  const { cartPriceUsd, cartItems } = useCartContext();
  const { satsToUsd } = useCryptoContext();
  const [finalPriceSats, setFinalPriceSats] = useState(0.0);

  useEffect(() => {
    setFinalPriceSats((cartPriceUsd * satsToUsd).toFixed(0))
  }, [cartPriceUsd, satsToUsd])

  return (
    <div className="text-left bg-[var(--cart-bg-color)] flex w-full flex-col gap-4">
      {cartItems.map((item) => (
        <div key={item.id} className="flex flex-col gap-2">
          <div className="w-full h-[2px] bg-gray-600" />
          <div className="flex flex-col md:grid md:grid-cols-4 2xl:grid-cols-6 w-full gap-2">
            <h5 className="text-[var(--secondary-text-color)]">
              {`${item.name}`}
            </h5>
            <h5>{`${item.quantity} ${item.quantity == 1 ? "Bag" : "Bags"}`}</h5>
            <h5 className="text-orange-500">
              <SatsIcon color="orange" />
              {(item.price * item.quantity * satsToUsd) > 0 ? (item.price * item.quantity * satsToUsd.toFixed(0)) : SATS_LOADING_STRING} Sats
            </h5>
            <h5 className="text-green-500">
              {`($${item.price * item.quantity} USD)`}
            </h5>
          </div>
          <div className="w-full h-[2px] bg-gray-600" />
        </div>
      ))}
      <div className="mt-4 flex flex-col md:grid md:grid-cols-4 2xl:grid-cols-6 w-full gap-2">
        <h4 className="font-bold">{`Subtotal`}</h4>
        <h4>
          <span className="text-orange-500 font-bold">
            <SatsIcon color="orange" />
            {`${finalPriceSats > 0 ? finalPriceSats : SATS_LOADING_STRING} Sats`}
          </span>
        </h4>
        <h4>
          <span className="text-green-500 font-bold">
            {` ($${cartPriceUsd} USD)`}
          </span>
        </h4>
      </div>
    </div>
  );
}
