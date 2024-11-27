import { useState } from 'react';
import { useReceiptContext } from '../../context/ReceiptContext';
import RelayPoolEditorLayout from './RelayPoolEditorLayout';

const NostrReceiptModalLayout = () => {
    const [npub, setNpub] = useState('');
    const { receipt } = useReceiptContext();

    const handleNostrReceipt = async () => {
        if (!npub) {
            return;
        }
        // await fetch('/nostr/send-receipt', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ npub, receipt, relayPool }),
        // });
    };

    return (
        <div className="relative flex flex-col mt-16 bg-[#1a1b26]/80 rounded-lg p-4">
            {/* Info Section */}
            <h2>Publish Receipt to Nostr Relays</h2>
            <h4 className="mt-4 text-yellow-500 animate-pulse mb-2">{`> Experimental Feature`}</h4>
            <p className="text-yellow-500 animate-pulse">{`This feature is being tested for stability and consistency.`}</p>
            <p className="mb-8 text-yellow-500 animate-pulse">{`After checkout, we'll show your receipt on-screen, so be sure to keep a copy of that receipt, just in case.`}</p>
            <div className="space-y-2 mb-6">
                <h5>1. Provide your Npub</h5>
                <input
                    className="w-full p-2 my-4"
                    type="text"
                    placeholder="npub"
                    id="checkout-npub"
                    name="checkout-npub"
                    value={npub}
                    onChange={(e) => setNpub(e.target.value)}
                />
                <h5>2. Select Relays</h5>
                <div className="flex items-start gap-2 text-sm text-gray-400">
                    <div className="text-yellow-400 mt-1">○</div>
                    <span>Enable NIP-17 for enhanced security, when supported by the relay.</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-400">
                    <div className="text-red-400 mt-1">○</div>
                    <span>Not sure if your client + relay supports NIP-17? Use NIP-04</span>
                </div>
            </div>
            <RelayPoolEditorLayout npub={npub} />
            <button
                type="button"
                disabled={!npub}
                onClick={() => handleNostrReceipt}
                className="w-full disabled:bg-blue-200 bg-blue-600 hover:bg-blue-500 rounded-lg py-3
                   font-mono text-white text-sm flex items-center justify-center gap-2"
            >
                3. Send Receipt
            </button>
        </div>
    )
};

export default NostrReceiptModalLayout;
