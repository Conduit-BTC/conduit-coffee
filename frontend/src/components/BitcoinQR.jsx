import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const BitcoinQR = ({ lightningInvoice }) => {
    const lightningUri = `lightning:${lightningInvoice}`;

    return (
        <div className="md:grid md:grid-cols-[1fr_2fr] p-4 border rounded-lg">
            <QRCodeSVG value={lightningUri} size={256} />
            <div className="mt-4 w-256 h-256 bg-black/10">
                <p className='break-all'>{lightningInvoice}</p>
            </div>
        </div>
    );
};

export default BitcoinQR;
