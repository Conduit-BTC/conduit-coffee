import { useState } from "react";
import { useCartContext } from "../context/CartContext";
import { useCryptoContext } from "../context/CryptoContext";
import SatsIcon from "./SatsIcon";

const SHIPPING_DISCOUNT = 0.8;

async function performCalculation(zip, cartItems) {
  const url = `${import.meta.env.VITE_API_URL}/shipping/rate`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ zip, cart: cartItems }),
  });

  if (!response.ok) {
    throw new Error(`Shipping calculation failed: ${response.statusText}`);
  }

  const usdCost = await response.json();
  return usdCost;
}

export default function ShippingCostCalculator() {
  const { cartItems } = useCartContext();
  const { satsToUsd } = useCryptoContext();
  const [satsCost, setSatsCost] = useState(0);
  const [usdCost, setUsdCost] = useState(0.0);
  const [zip, setZip] = useState("");
  const [error, setError] = useState(null);

  const handleCalculation = async () => {
    try {
      setError(null);
      const res = await performCalculation(zip, cartItems);
      if (res) {
        const baseCost = (res * SHIPPING_DISCOUNT).toFixed(2);
        setUsdCost(baseCost);
        setSatsCost(baseCost * satsToUsd);
      }
    } catch (err) {
      console.error("Shipping calculation error:", err);
      setError(err.message || "Unable to calculate shipping cost");

      // Clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <section className="flex flex-col pt-4">
      {error && (
        <div className="sticky top-0 z-50 w-full p-4 mb-8 bg-red-100 border-2 border-red-500 text-red-700 text-center rounded text-lg font-bold">
          {error} ❌
        </div>
      )}

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
        onClick={handleCalculation}
      >
        {`>> Calculate Estimated Shipping Cost << `}
      </button>
      <h4>Estimated Shipping Cost</h4>
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
