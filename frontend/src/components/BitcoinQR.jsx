import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const BitcoinQR = ({ lightningInvoice, onChainAddress, amount, label, message }) => {
    const [paymentMethod, setPaymentMethod] = useState('lightning');

    const lightningUri = `lightning:${lightningInvoice}`;
    const onChainUri = `bitcoin:${onChainAddress}?amount=${amount}&label=${encodeURIComponent(label)}&message=${encodeURIComponent(message)}`;

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    const handleLightningClick = () => {
        window.location.href = lightningUri;
    };

    return (
        <div className="p-4 border rounded-lg">
            <div className="mb-4">
                <button
                    onClick={() => handlePaymentMethodChange('lightning')}
                    className={`mr-2 px-4 py-2 rounded ${paymentMethod === 'lightning' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    Lightning
                </button>
                <button
                    onClick={() => handlePaymentMethodChange('onchain')}
                    className={`px-4 py-2 rounded ${paymentMethod === 'onchain' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                    On-chain
                </button>
            </div>

            {paymentMethod === 'lightning' ? (
                <>
                    <QRCodeSVG value={lightningUri} size={256} />
                    <button onClick={handleLightningClick} className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded">
                        Open in Lightning Wallet
                    </button>
                    <Alert className="mt-4">
                        <AlertTitle>Lightning Payment</AlertTitle>
                        <AlertDescription>
                            You need a Lightning-compatible wallet to use this payment method. If the button doesn't work, try scanning the QR code with your Lightning wallet.
                        </AlertDescription>
                    </Alert>
                </>
            ) : (
                <>
                    <QRCodeSVG value={onChainUri} size={256} />
                    <Alert className="mt-4">
                        <AlertTitle>On-chain Bitcoin Payment</AlertTitle>
                        <AlertDescription>
                            Scan this QR code with any Bitcoin wallet to make an on-chain payment.
                        </AlertDescription>
                    </Alert>
                </>
            )}

            <div className="mt-4">
                <h3 className="font-bold">Payment Details:</h3>
                <p>Amount: {amount} BTC</p>
                <p>Label: {label}</p>
                <p>Message: {message}</p>
            </div>
        </div>
    );
};

export default BitcoinQR;
