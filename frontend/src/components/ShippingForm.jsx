import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ShippingCostCalculator from "./ShippingCostCalculator";

const ShippingForm = ({ onSubmit, cartPriceUsd, error }) => {
    const [submitError, setSubmitError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        try {
            const formData = {
                first_name: e.target['checkout-first_name'].value,
                last_name: e.target['checkout-last_name'].value,
                address1: e.target['checkout-address-1'].value,
                address2: e.target['checkout-address-2'].value,
                city: e.target['checkout-city'].value,
                state: e.target['checkout-state'].value,
                zip: e.target['checkout-zip'].value,
                special_instructions: e.target['checkout-special-instructions'].value,
                email: e.target['checkout-email'].value,
                npub: e.target['checkout-npub'].value,
            };

            await onSubmit(formData);
        } catch (error) {
            console.error("Form submission error:", error);
            setSubmitError(error.message || 'Unable to connect to payment server');

            // Clear error after 5 seconds
            setTimeout(() => {
                setSubmitError(null);
            }, 5000);
        }
    };

    const displayError = error || submitError;

    return (
        <>
            <ShippingCostCalculator />
            <div className="w-full h-1 bg-gray-600 my-8" />

            {displayError && (
                <div className="sticky top-0 z-50 w-full p-4 mb-8 bg-red-100 border-2 border-red-500 text-red-700 text-center rounded text-lg font-bold">
                    {displayError} ❌
                </div>
            )}

            <h3 className="mb-2">{`Shipping Address`}</h3>
            <h6>{`We don't need to know you, we just need a place to send your coffee.`}</h6>

            <form onSubmit={handleSubmit}>
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="First Name"
                    id="checkout-first_name"
                    name="checkout-first_name"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="Last Name"
                    id="checkout-last_name"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="address"
                    placeholder="Street Address"
                    id="checkout-address-1"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="address"
                    placeholder="Street Address (line 2)"
                    id="checkout-address-2"
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="City"
                    id="checkout-city"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="State"
                    id="checkout-state"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="Zip Code"
                    id="checkout-zip"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="Special Instructions?"
                    id="checkout-special-instructions"
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
                    id="checkout-email"
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="Nostr npub key (optional)"
                    id="checkout-npub"
                />
                <button
                    type="submit"
                    disabled={cartPriceUsd <= 0.0}
                    className="w-full mt-4 bg-blue-500 p-8 text-xl text-[var(--main-text-color)] hover:font-bold disabled:opacity-50"
                >
                    {`>> Pay With Lightning <<`}
                </button>
            </form>
        </>
    );
};

ShippingForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    cartPriceUsd: PropTypes.number.isRequired,
    error: PropTypes.string
};

export default ShippingForm;
