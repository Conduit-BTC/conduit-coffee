import CurrentHodlings from "../../components/CurrentHodlings";
import { useCartContext } from "../../context/CartContext";
import { useCryptoContext } from "../../context/CryptoContext";
import { useEffect, useState } from "react";
import ShippingCostCalculator from "../../components/ShippingCostCalculator";
import BitcoinQR from "../../components/BitcoinQR";

export default function CheckoutLayout() {
  const [lightningInvoice, setLightningInvoice] = useState(null);
  const { satsToUsd } = useCryptoContext();
  const { cartItems, cartPriceUsd } = useCartContext();

  async function postNewOrder(orderData) {
    const url = import.meta.env.VITE_API_URL;
    if (!url) {
      console.error(
        "CheckoutLayout: Environment Variable missing: VITE_API_URL"
      );
      return;
    }
    try {
      const response = await fetch(`${url}/orders/pos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        setLightningInvoice(data.lightningInvoice);
      } else {
        console.error("Failed to create order:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }

  return (
    <>
      <h1 className="text-h2 pr-12 text-blue-500 mb-2">
        ⚡️ Zap the Lightning
      </h1>
      <h1 className="text-h2 pr-12 text-orange-700 mb-8">☕️ Get the Coffee</h1>
      <div className="mb-8">
        <h3 className="mb-8">Your Order:</h3>
        <CurrentHodlings />
      </div>
      <div className="w-full h-1 bg-gray-600" />
      {/* <ShippingCostCalculator />
      <div className="w-full h-1 bg-gray-600 my-8" />
      <h3 className="mb-2">{`Shipping Address`}</h3>
      <h6>{`We don't need to know you, we just need a place to send your coffee.`}</h6> */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const url = import.meta.env.VITE_API_URL;
          if (!url) {
            console.error(
              "CheckoutLayout: Environment Variable missing: VITE_API_URL"
            );
            return;
          }
          const cartData = {
            sats_cart_price: satsToUsd * cartPriceUsd,
            usd_cart_price: cartPriceUsd,
            items: cartItems,
          };
          const orderData = {
            // first_name: document.getElementById("first_name").value,
            // last_name: document.getElementById("last_name").value,
            // address1: document.getElementById("address-1").value,
            // address2: document.getElementById("address-2").value,
            // city: document.getElementById("city").value,
            // state: document.getElementById("state").value,
            // zip: document.getElementById("zip").value,
            // special_instructions: document.getElementById(
            //   "special-instructions"
            // ).value,
            // email: document.getElementById("email").value,
            cart: cartData,
          };
          postNewOrder(orderData);
        }}
      >
        {lightningInvoice ? (
          <BitcoinQR
            width={300}
            height={300}
            lightningInvoice={lightningInvoice}
            parameters="amount=0.00001&label=sbddesign%3A%20For%20lunch%20Tuesday&message=For%20lunch%20Tuesday"
            image="https://voltage.imgix.net/Team.png?fm=webp&w=160"
            type="svg"
            cornersSquareColor="#b23c05"
            cornersDotColor="#e24a04"
            cornersSquareType="extra-rounded"
            dotsType="classy-rounded"
            dotsColor="#ff5000"
          />
        ) : (
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 p-8 text-xl text-[var(--main-text-color)] hover:font-bold"
          >
            {`>> Pay With Lightning <<`}
          </button>
        )}
      </form>
    </>
  );
}
