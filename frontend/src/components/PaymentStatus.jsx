import React from 'react';
import { BitcoinQR } from "./BitcoinQR";
import { ConfettiEffect } from "./ConfettiEffect";
import ReceiptExport from "./ReceiptExport";

const PaymentStatus = ({
    lightningInvoice,
    paymentStatus,
    receipt,
    connectionStatus,
    error,
    cartPriceUsd,
    onSubmitPayment
}) => {
    // Payment successful state
    if (paymentStatus === 'paid') {
        return (
            <div className='space-y-8'>
                <ConfettiEffect />
                <h2 className="mt-4 text-green-500 font-bold w-full text-center">
                    ⚡ Zap Received! ⚡
                </h2>
                <div className="bg-gray-900 border-t border-gray-800 p-4">
                    <ReceiptExport receiptContent={receipt} />
                </div>
                <pre className="font-mono whitespace-pre-wrap bg-gray-900 text-gray-100 p-4 rounded">
                    {receipt}
                </pre>
            </div>
        );
    }

    // Show QR code only when server is connected and we have an invoice
    if (lightningInvoice && connectionStatus === 'connected') {
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
            </div>
        );
    }

    // Show status messages when there's an invoice but server isn't connected
    if (lightningInvoice) {
        return (
            <div className="flex flex-col items-center">
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
        <div className="flex flex-col items-center w-full">
            {error && (
                <div className="w-full mb-4 p-4 bg-red-100 border border-red-400 text-red-700 text-center rounded">
                    Unable to connect to payment server. Please try again later. ❌
                </div>
            )}
            <button
                type="submit"
                disabled={cartPriceUsd <= 0.0}
                className="w-full mt-4 bg-blue-500 p-8 text-xl text-[var(--main-text-color)] hover:font-bold disabled:opacity-50"
                onClick={onSubmitPayment}
            >
                {`>> Pay With Lightning <<`}
            </button>
        </div>
    );
};

export default PaymentStatus;
