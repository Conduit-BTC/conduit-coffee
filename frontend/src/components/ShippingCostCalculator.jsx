import { useState, useEffect } from "react";
import { useCartContext } from "../context/CartContext";
import { useCryptoContext } from "../context/CryptoContext";
import SatsIcon from "./SatsIcon";

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

export default function ShippingCostCalculator({ onShippingCostCalculated }) {
  const { cartItems } = useCartContext();
  const { satsToUsd } = useCryptoContext();
  const [satsCost, setSatsCost] = useState(0);
  const [usdCost, setUsdCost] = useState(0.0);
  const [zip, setZip] = useState("");
  const [error, setError] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Clear costs when cart changes
  useEffect(() => {
    setSatsCost(0);
    setUsdCost(0);
    if (onShippingCostCalculated) {
      onShippingCostCalculated(0);
    }
  }, [cartItems]);

  const handleCalculation = async () => {
    try {
      setIsCalculating(true);
      setError(null);
      const res = await performCalculation(zip, cartItems);
      if (res) {
        const baseCost = (res).toFixed(2);
        setUsdCost(baseCost);
        setSatsCost(baseCost * satsToUsd);

        // Notify parent component of the new shipping cost
        if (onShippingCostCalculated) {
          onShippingCostCalculated(parseFloat(baseCost));
        }
      }
    } catch (err) {
      console.error("Shipping calculation error:", err);
      setError(err.message || "Unable to calculate shipping cost");

      // Reset costs and notify parent
      setUsdCost(0);
      setSatsCost(0);
      if (onShippingCostCalculated) {
        onShippingCostCalculated(0);
      }

      // Clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleZipChange = (e) => {
    const newZip = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
    setZip(newZip);

    // Reset costs when ZIP changes
    setUsdCost(0);
    setSatsCost(0);
    if (onShippingCostCalculated) {
      onShippingCostCalculated(0);
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
      <div className="flex flex-col gap-4">
        <input
          className="p-2 bg-blue-300 text-black mt-4 placeholder:text-black"
          type="text"
          placeholder="Enter ZIP code"
          value={zip}
          onChange={handleZipChange}
          maxLength={5}
        />
        <button
          disabled={!zip || zip.length < 5 || isCalculating}
          className={`p-4 flex justify-center items-center ${zip && zip.length >= 5 && !isCalculating
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-blue-500/20"
            }`}
          onClick={handleCalculation}
        >
          {isCalculating
            ? "Calculating..."
            : ">> Calculate Estimated Shipping Cost <<"
          }
        </button>
      </div>
    </section>
  );
}
