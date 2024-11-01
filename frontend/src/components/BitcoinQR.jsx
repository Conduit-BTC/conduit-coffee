import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Zap, Coffee } from 'lucide-react';

export const BitcoinQR = ({
    lightningInvoice,
    width = 300,
}) => {
    const [copied, setCopied] = useState(false);
    const lightningUri = `lightning:${lightningInvoice}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(lightningInvoice);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-8 bg-slate-900 rounded-lg border-2 border-blue-500/50 relative overflow-hidden">
            {/* Cyber corner decorations */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-blue-400/50 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-blue-400/50 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-400/50 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-blue-400/50 rounded-br-lg" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <Zap className="text-yellow-400 w-6 h-6 animate-pulse" />
                    <span className="text-blue-400 font-mono text-lg">Zap the Lightning</span>
                </div>
                <div className="flex items-center space-x-3">
                    <Coffee className="text-orange-400 w-6 h-6" />
                    <span className="text-orange-400 font-mono text-lg">Get the Coffee</span>
                </div>
            </div>

            {/* QR Code Section */}
            <div className="grid md:grid-cols-[1fr_2fr] gap-6 bg-slate-800/50 p-6 rounded-lg border border-blue-400/30">
                <div className="relative group flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors rounded-lg" />
                    <QRCodeSVG
                        value={lightningUri}
                        size={Math.max(width, 400)}
                        className="w-full h-auto bg-white p-3 rounded-lg"
                        level="M"
                    />
                </div>

                <div className="relative">
                    <div className="font-mono text-sm break-all text-slate-300 p-6 bg-slate-900 rounded-lg h-full border border-blue-400/20">
                        {lightningInvoice}
                        <button
                            onClick={handleCopy}
                            className="absolute bottom-3 right-3 p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                            aria-label="Copy invoice"
                        >
                            <Copy className={`w-5 h-5 ${copied ? 'text-green-400' : 'text-blue-400'}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BitcoinQR;
