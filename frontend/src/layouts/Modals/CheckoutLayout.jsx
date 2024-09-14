import CurrentHodlings from "../../components/CurrentHodlings";
import { useCartContext } from "../../context/CartContext";
import { useCryptoContext } from "../../context/CryptoContext";
import { useState } from "react";
import ShippingCostCalculator from "../../components/ShippingCostCalculator";

export default function CheckoutLayout() {
  const [invoiceUrl, setInvoiceUrl] = useState("");
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
      const response = await fetch(`${url}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        setInvoiceUrl(data.invoiceUrl);
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
      <div className="w-full h-1 bg-gray-600 mb-8" />
      {/* <ShippingCostCalculator /> */}
      <div className="w-full h-1 bg-gray-600 my-8" />
      <h3 className="mb-2">{`Shipping Address`}</h3>
      <h6>{`We don't need to know you, we just need a place to send your coffee.`}</h6>
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
            first_name: document.getElementById("first_name").value,
            last_name: document.getElementById("last_name").value,
            address1: document.getElementById("address-1").value,
            address2: document.getElementById("address-2").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            zip: document.getElementById("zip").value,
            special_instructions: document.getElementById(
              "special-instructions"
            ).value,
            email: document.getElementById("email").value,
            cart: cartData,
          };
          postNewOrder(orderData);
        }}
      >
        <input
          className="w-full p-2 mt-4"
          type="text"
          placeholder="First Name"
          id="first_name"
          required
        />
        <input
          className="w-full p-2 mt-4"
          type="text"
          placeholder="Last Name"
          id="last_name"
          required
        />
        <input
          className="w-full p-2 mt-4"
          type="address"
          placeholder="Street Address"
          id="address-1"
          required
        />
        <input
          className="w-full p-2 mt-4"
          type="address"
          placeholder="Street Address (line 2)"
          id="address-2"
        />
        <input
          className="w-full p-2 mt-4"
          type="text"
          placeholder="City"
          id="city"
        />
        <input
          className="w-full p-2 mt-4"
          type="text"
          placeholder="State"
          id="state"
        />
        <input
          className="w-full p-2 mt-4"
          type="text"
          placeholder="Zip Code"
          id="zip"
          required
        />
        <input
          className="w-full p-2 mt-4"
          type="text"
          placeholder="Special Instructions?"
          id="special-instructions"
        />
        <h3 className="mt-8 mb-2">
          {`Contact Info`}
          <span className="text-sm">{` (Optional)`}</span>
        </h3>
        <h6>{`We'll send you a tracking number and receipt, nothing else. Skip it if you're off-the-radar `}</h6>
        <input
          className="w-full p-2 mt-4"
          type="email"
          placeholder="Email (optional)"
          id="email"
        />
        <input
          className="w-full p-2 mt-4"
          type="text"
          placeholder="Nostr npub key (optional)"
          id="email"
        />
        {invoiceUrl ? (
          <button
            onClick={() => window.open(invoiceUrl, "_blank")}
            className="w-full p-2 mt-4 bg-orange-500 text-[var(--main-text-color)] hover:font-bold "
          >
            {`Go to Invoice >>`}
          </button>
        ) : (
          <button
            type="submit"
            className="w-full p-2 mt-4 bg-blue-500 text-[var(--main-text-color)] hover:font-bold"
          >
            {`>> Pay With Lightning <<`}
          </button>
        )}
      </form>
    </>
  );
}
