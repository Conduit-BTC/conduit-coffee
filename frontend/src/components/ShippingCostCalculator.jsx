import { useState } from "react";
import { useCartContext } from "../context/CartContext";

export default function ShippingCostCalculator({ zip }) {
  const { cartItems } = useCartContext();
  const [cost, setCost] = useState(0.0);

  const performCalculation = async () => {
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
      const data = await response.json();
      console.log("Total cost: ", data);
    } else {
      console.error("Failed to calculate shipping cost:", response.statusText);
    }
  };

  return (
    <section className="flex flex-col">
      <h3>Shipping Calculator</h3>
      <button onClick={performCalculation}>Calculate Shipping Cost</button>
      <h4>{`Shipping Cost: $${cost} / ___ Sats`}</h4>
    </section>
  );
}
