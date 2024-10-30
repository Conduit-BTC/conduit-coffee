import React, { useState, useEffect } from 'react';
import CurrentHodlings from "../../components/CurrentHodlings";
import { useCartContext } from "../../context/CartContext";
import { useCryptoContext } from "../../context/CryptoContext";
import { useWebSocketPayment } from '../../hooks/useWebSocketPayment';
import PaymentStatus from '../../components/PaymentStatus';
import ShippingForm from '../../components/ShippingForm';

export default function CheckoutLayout() {
  const [lightningInvoice, setLightningInvoice] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);
  const { paymentStatus, connectionStatus, error } = useWebSocketPayment(invoiceId);
  const { satsToUsd } = useCryptoContext();
  const { cartItems, cartPriceUsd } = useCartContext();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const shouldShowShippingForm = !lightningInvoice && paymentStatus !== 'paid';

  useEffect(() => {
    if (!shouldShowShippingForm) {
      // Start transition
      setIsTransitioning(true);

      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Reset transition state after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Match this with CSS transition duration

      return () => clearTimeout(timer);
    }
  }, [shouldShowShippingForm]);

  async function postNewOrder(orderData) {
    const url = import.meta.env.VITE_API_URL;
    if (!url) {
      console.error("CheckoutLayout: Environment Variable missing: VITE_API_URL");
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
        setLightningInvoice(data.lightningInvoice);
        setInvoiceId(data.invoiceId);
      } else {
        console.error("Failed to create order:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = import.meta.env.VITE_API_URL;
    if (!url) {
      console.error("CheckoutLayout: Environment Variable missing: VITE_API_URL");
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
      special_instructions: document.getElementById("special-instructions").value,
      email: document.getElementById("email").value,
      cart: cartData,
    };
    postNewOrder(orderData);
  };

  return (
    <>
      <div className="transition-opacity duration-300 ease-in-out">
        <h1 className="text-h2 pr-12 text-blue-500 mb-2">⚡️ Zap the Lightning</h1>
        <h1 className="text-h2 pr-12 text-orange-700 mb-8">☕️ Get the Coffee</h1>
        <div className="mb-8">
          <h3 className="mb-8">Your Order:</h3>
          <CurrentHodlings />
        </div>
        <div className="w-full h-1 bg-gray-600" />
      </div>

      <div className={`transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
        {shouldShowShippingForm ? (
          <ShippingForm
            onSubmit={handleSubmit}
            cartPriceUsd={cartPriceUsd}
          />
        ) : (
          <div className="mt-8 flex justify-center">
            <PaymentStatus
              lightningInvoice={lightningInvoice}
              paymentStatus={paymentStatus}
              connectionStatus={connectionStatus}
              error={error}
              cartPriceUsd={cartPriceUsd}
            />
          </div>
        )}
      </div>
    </>
  );
}
