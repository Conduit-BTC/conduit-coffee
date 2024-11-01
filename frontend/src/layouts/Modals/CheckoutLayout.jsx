// CheckoutLayout.jsx
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
  const [submitError, setSubmitError] = useState(null);
  const { receipt, paymentStatus, connectionStatus, error } = useWebSocketPayment(invoiceId);
  const { satsToUsd } = useCryptoContext();
  const { cartItems, cartPriceUsd } = useCartContext();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const shouldShowShippingForm = !lightningInvoice && paymentStatus !== 'paid';

  useEffect(() => {
    if (!shouldShowShippingForm) {
      setIsTransitioning(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [shouldShowShippingForm]);

  async function postNewOrder(orderData) {
    const url = import.meta.env.VITE_API_URL;
    if (!url) {
      throw new Error("Configuration error: API URL not found");
    }

    const response = await fetch(`${url}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Your address looks invalid. Be sure you've entered a proper address. Note: we are only accepting orders in the United States at this time.");
      }
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }

  const handleSubmit = async (formData) => {
    try {
      setSubmitError(null);

      const cartData = {
        sats_cart_price: satsToUsd * cartPriceUsd,
        usd_cart_price: cartPriceUsd,
        items: cartItems,
      };

      const orderData = {
        ...formData,
        cart: cartData,
      };

      const responseData = await postNewOrder(orderData);
      setLightningInvoice(responseData.lightningInvoice);
      setInvoiceId(responseData.invoiceId);
    } catch (error) {
      setSubmitError(error.message);
      throw error; // Re-throw to let ShippingForm handle UI feedback
    }
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
            error={submitError}
          />
        ) : (
          <div className="mt-8 flex justify-center">
            <PaymentStatus
                receipt={receipt}
              lightningInvoice={lightningInvoice}
              paymentStatus={paymentStatus}
              connectionStatus={connectionStatus}
              error={error}
              cartPriceUsd={cartPriceUsd}
                submitError={submitError}
            />
          </div>
        )}
      </div>
    </>
  );
}
