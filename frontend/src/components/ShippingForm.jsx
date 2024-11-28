import { useState } from 'react';
import PropTypes from 'prop-types';
import ShippingCostCalculator from './ShippingCostCalculator';

const ShippingForm = ({ onSubmit, error, onShippingCostUpdate }) => {
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
            };

            await onSubmit(formData);
        } catch (error) {
            console.error("Form submission error:", error);
            setSubmitError(error.message || 'Unable to connect to payment server');

            setTimeout(() => {
                setSubmitError(null);
            }, 5000);
        }
    };

    const handleShippingCalculated = (cost) => {
        onShippingCostUpdate(cost);
    };

    const displayError = error || submitError;

    return (
        <div className='p-4 md:p-8'>
            <ShippingCostCalculator onShippingCostCalculated={handleShippingCalculated} />
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
                    name="checkout-last_name"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="Street Address"
                    id="checkout-address-1"
                    name="checkout-address-1"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="Street Address (line 2)"
                    id="checkout-address-2"
                    name="checkout-address-2"
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="City"
                    id="checkout-city"
                    name="checkout-city"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="State"
                    id="checkout-state"
                    name="checkout-state"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="Zip Code"
                    id="checkout-zip"
                    name="checkout-zip"
                    required
                />
                <input
                    className="w-full p-2 mt-4"
                    type="text"
                    placeholder="Special Instructions?"
                    id="checkout-special-instructions"
                    name="checkout-special-instructions"
                />
                <button
                    type="submit"
                    className="w-full mt-8 bg-blue-500 p-8 text-xl text-[var(--main-text-color)] hover:font-bold disabled:opacity-50"
                >
                    {`>> Pay With Lightning <<`}
                </button>
            </form>
        </div>
    );
};

ShippingForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    cartPriceUsd: PropTypes.number.isRequired,
    error: PropTypes.string,
    onShippingCostUpdate: PropTypes.func.isRequired
};

export default ShippingForm;
