import { useState } from "react";
import { useCartContext } from "../context/CartContext";
import { useCryptoContext } from "../context/CryptoContext";
import SatsIcon from "./SatsIcon";

async function performCalculation(zip, cartItems) {
  const url = "http://localhost:3456/shipping/rate";
  //   import.meta.env.VITE_API_URL || "https://conduit-service.fly.dev";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ zip, cart: cartItems }),
  });

  if (response.ok) {
    const usdCost = await response.json();
    return usdCost;
  } else {
    console.error("Failed to calculate shipping cost:", response.statusText);
  }
}

export default function ShippingCostCalculator() {
  const { cartItems } = useCartContext();
  const { satsToUsd } = useCryptoContext();
  const [satsCost, setSatsCost] = useState(0);
  const [usdCost, setUsdCost] = useState(0.0);
  const [zip, setZip] = useState("");

  return (
    <section className="flex flex-col">
      <h3>Shipping Calculator</h3>
      <input
        className="p-2 bg-blue-300 text-black mt-4 placeholder:text-black"
        type="text"
        placeholder="Enter ZIP code"
        onChange={(e) => {
          setZip(e.target.value);
        }}
      />
      <button
        disabled={!zip || zip.length < 5}
        className={`p-4 flex my-4 ${
          zip && zip.length >= 5 ? "bg-blue-500" : "bg-blue-500/20"
        }`}
        onClick={async () => {
          const res = await performCalculation(zip, cartItems);
          if (res) {
            setUsdCost(res);
            setSatsCost(res * satsToUsd);
          } else {
            // TODO: Display error state
          }
        }}
      >
        {`>> Calculate Shipping Cost << `}
      </button>
      <h4>Shipping Cost</h4>
      <h4>
        <span className="text-orange-500">
          <SatsIcon color="orange" />
          {`${Math.floor(satsCost)} Sats`}
        </span>
      </h4>
      <h4>
        <span className="text-green-500">{` ($${usdCost} USD)`}</span>
      </h4>
    </section>
  );
}
