import React from 'react';
import { BitcoinQR } from "./BitcoinQR";
import { ConfettiEffect } from "./ConfettiEffect";

const PaymentStatus = ({
    lightningInvoice,
    paymentStatus,
    connectionStatus,
    error,
    cartPriceUsd,
    onSubmitPayment
}) => {
    // Show payment success state
    if (paymentStatus === 'paid') {
        return (
            <div>
                <ConfettiEffect />
                <div className="mt-4 text-green-500 font-bold text-xl">
                    Payment Received! ⚡
                </div>
            </div>
        );
    }

    // Show QR code with connection status
    if (lightningInvoice) {
        return (
            <div className="flex flex-col items-center">
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
                {connectionStatus === 'connected' && (
                    <div className="mt-2 text-green-500">
                        Watching for payment... ⚡
                    </div>
                )}
                {connectionStatus === 'disconnected' && (
                    <div className="mt-2 text-yellow-500">
                        Reconnecting to payment server... 🔄
                    </div>
                )}
                {connectionStatus === 'error' && (
                    <div className="mt-2 text-red-500">
                        {error || 'Error connecting to payment server'} ❌
                    </div>
                )}
            </div>
        );
    }

    // Initial payment button
    return (
        <button
            type="submit"
            disabled={cartPriceUsd <= 0.0}
            className="w-full mt-4 bg-blue-500 p-8 text-xl text-[var(--main-text-color)] hover:font-bold"
            onClick={onSubmitPayment}
        >
            {`>> Pay With Lightning <<`}
        </button>
    );
};

export default PaymentStatus;
