import { SATS_LOADING_STRING } from "../constants";
import { useCryptoContext } from "../context/CryptoContext";

import SatsIcon from "./SatsIcon";

export default function ExchangeRateBox() {
  const { satsToUsd } = useCryptoContext();

  return (
    <div className="text-left p-4 bg-black/25">
      <h4 className=" mb-2">Conversion Rate</h4>
      <h5 className="  mb-4">
        {" "}
        <span className="text-green-500"> $1.00 </span> ={" "}
        <span className="text-orange-500">
          <SatsIcon color="orange" />
          {satsToUsd > 0.0 ? satsToUsd.toFixed(0) : SATS_LOADING_STRING}
          <span className="text-xs">{` (Satoshis)`}</span>
        </span>
      </h5>
      <p className="text-xs mt-4">*Strike Real-Time Rate</p>
    </div>
  );
}
