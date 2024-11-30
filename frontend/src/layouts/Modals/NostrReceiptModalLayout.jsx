import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useReceiptContext } from '../../context/ReceiptContext';
import RelayPoolEditorLayout from './RelayPoolEditorLayout';
import { useNostrContext } from '../../context/NostrContext';
import { ConfettiEffect } from '../../components/ConfettiEffect';

const NostrReceiptModalLayout = () => {
  const [npub, setNpub] = useState('');
  const { receipt } = useReceiptContext();
  const { relayList } = useNostrContext();
  const [isLoading, setIsLoading] = useState(false);
  const [failedRelays, setFailedRelays] = useState([]);
  const [successfulRelays, setSuccessfulRelays] = useState([]);

  const handleNostrReceipt = async () => {
    if (!npub) return;
    setIsLoading(true);
    setFailedRelays([]);
    setSuccessfulRelays([]);

    try {
      const results = await Promise.all(
        relayList.map(async relay => {
          try {
            const result = await publishReceipt(npub, receipt, relay);
            return { relay, success: result.ok };
          } catch (error) {
            return { relay, success: false };
          }
        })
      );

      const newSuccessfulRelays = results
        .filter(result => result.success)
        .map(result => result.relay.url);

      const newFailedRelays = results
        .filter(result => !result.success)
        .map(result => result.relay.url);

      setSuccessfulRelays(newSuccessfulRelays);
      setFailedRelays(newFailedRelays);
    } finally {
      setIsLoading(false);
    }
  };

  const publishReceipt = async (npub, receipt, relay) => {
    const url = `${import.meta.env.VITE_API_URL}/nostr/receipts/send`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ npub, receipt, relay }),
    });

    // Return the response instead of directly setting state
    return response;
  };

  return (
    <div className="relative flex flex-col mt-16 bg-[#1a1b26]/80 rounded-lg p-4">
      {/* Info Section */}
      <h2>Publish Receipt to Nostr Relays</h2>
      <h4 className="mt-4 text-yellow-500 animate-pulse mb-2">{`> Experimental Feature`}</h4>
      <p className="text-yellow-500 animate-pulse mb-8">{`This feature is being tested for stability and consistency. Be sure to keep another copy of your receipt, just in case.`}</p>
      <div className='h-[1px] bg-gray-700 w-full mb-6'></div>
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
      </div>
      <div className='h-[1px] bg-gray-700 w-full mb-6'></div>
      <RelayPoolEditorLayout npub={npub} failedRelays={failedRelays} />
      <div className='h-[1px] bg-gray-700 w-full mb-6'></div>
      <button
        type="button"
        disabled={npub.length < 60}
        onClick={handleNostrReceipt}
        className="w-full disabled:bg-blue-200 bg-blue-600 hover:bg-blue-500 rounded-lg py-3
                   font-mono text-white text-sm flex items-center justify-center gap-2"
      >
        3. Send Receipt
      </button>
      <RelayStatus
        successfulRelays={successfulRelays}
        failedRelays={failedRelays}
        isLoading={isLoading}
      />          </div>
  )
};

const RelayStatus = ({ successfulRelays = [], failedRelays = [], isLoading = false }) => {
  if (!isLoading && successfulRelays.length === 0 && failedRelays.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Loading State */}
      {isLoading && (
        <div className="rounded-lg bg-[#1e2028] p-4">
          <div className="flex items-center gap-2">
            <Loader2 className="text-blue-500 animate-spin" size={24} />
            <span className="text-blue-500 font-bold text-lg">
              Broadcasting to Nostr network...
            </span>
          </div>
        </div>
      )}

      {/* Successful Relays */}
      {successfulRelays.length > 0 && (
        <div className="rounded-lg bg-[#1e2028] p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="text-green-500" size={24} />
            <span className="text-green-500 font-bold text-lg">
              Successfully Published!
            </span>
          </div>
          <div className="text-gray-400 mb-3 pl-8">
            Receipt broadcasted to {successfulRelays.length} {successfulRelays.length === 1 ? 'relay' : 'relays'}
          </div>
          <ConfettiEffect />
          <div className="space-y-2">
            {successfulRelays.map((relay, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-400 font-mono text-sm pl-8"
              >
                {relay}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Failed Relays */}
      {failedRelays.length > 0 && (
        <div className="rounded-lg bg-red-950/30 border border-red-800/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="text-red-500" size={24} />
            <span className="text-red-500 font-bold text-lg">
              Publication Failed
            </span>
          </div>
          <div className="text-red-400 mb-3 pl-8">
            Unable to reach {failedRelays.length} {failedRelays.length === 1 ? 'relay' : 'relays'}
          </div>
          <div className="space-y-2">
            {failedRelays.map((relay, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-red-400 font-mono text-sm pl-8"
              >
                {relay}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NostrReceiptModalLayout;
