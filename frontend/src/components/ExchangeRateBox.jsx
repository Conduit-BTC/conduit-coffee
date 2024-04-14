import { useCryptoContext } from "../context/CryptoContext";
import { BASE_COST_PER_BAG } from "../constants";
import { useCartContext } from "../context/CartContext";

import SatsIcon from "./SatsIcon";

export default function ExchangeRateBox() {
  const { satsToUsd } = useCryptoContext();

  return (
    <div className="text-left p-2 bg-[var(--cart-bg-color)]">
      <h4 className=" mb-2">Conversion Rate</h4>
      <h5 className="  mb-4">
        {" "}
        <span className="text-green-500"> $1.00 </span> ={" "}
        <span className="text-orange-500">
          <SatsIcon color="orange" />
          {satsToUsd >= 0.0 ? satsToUsd.toFixed(0) : "-"}
          <span className="text-xs">{` (Satoshis)`}</span>
        </span>
      </h5>
      <p className="text-xs mt-4">*CoinGecko Real-Time Rate</p>
    </div>
  );
}
