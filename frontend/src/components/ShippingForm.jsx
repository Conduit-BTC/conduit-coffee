import React from 'react';
import PropTypes from 'prop-types';
import ShippingCostCalculator from "./ShippingCostCalculator";

const ShippingForm = ({ onSubmit, cartPriceUsd }) => {
    return (
        <>
            <ShippingCostCalculator />
            <div className="w-full h-1 bg-gray-600 my-8" />
            <h3 className="mb-2">{`Shipping Address`}</h3>
            <h6>{`We don't need to know you, we just need a place to send your coffee.`}</h6>
            <form onSubmit={onSubmit}>
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
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="State"
                    id="state"
                    required
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
                    id="npub"
                />

                <button
                    type="submit"
                    disabled={cartPriceUsd <= 0.0}
                    className="w-full mt-4 bg-blue-500 p-8 text-xl text-[var(--main-text-color)] hover:font-bold"
                >
                    {`>> Pay With Lightning <<`}
                </button>
            </form>
        </>
    );
};

ShippingForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    cartPriceUsd: PropTypes.number.isRequired
};

export default ShippingForm;
