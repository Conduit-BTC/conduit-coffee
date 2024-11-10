import React, { useState, useEffect } from 'react';
import { X, Plus, RotateCcw } from 'lucide-react';
import { useNostrContext } from '../../context/NostrContext';

export default function RelayPoolEditorLayout({ npub }) {  // Add npub prop
    const {
        relayList,
        relayProtocols,
        addRelay,
        removeRelay,
        resetRelays,
        toggleProtocol,
        isLoading,
        setLoading,
        error,
        setError,
        setRelayPool
    } = useNostrContext();
    const [newRelay, setNewRelay] = useState('');

    useEffect(() => {
        const fetchRelayPool = async () => {
            if (!npub || npub.length < 60) return; // Don't fetch if npub is invalid

            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/nostr/npub/${npub}/relaypool`);
                if (!response.ok) {
                    if (response.status === 404) {
                        // If no relay pool exists yet, that's okay
                        return;
                    }
                    throw new Error('Failed to fetch relay pool');
                }
                const data = await response.json();
                setRelayPool(data.data);
            } catch (err) {
                console.error('Error fetching relay pool:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRelayPool();
    }, [npub]);

    const handleAddRelay = (e) => {
        e.preventDefault();
        if (newRelay && !relayList.includes(newRelay)) {
            addRelay(newRelay);
            setNewRelay('');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                <span className="ml-2">Fetching RelayPool...</span>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col items-start mb-6 gap-2">
                <h2 className="text-xl text-blue-500">Nostr Relay Pool Editor</h2>
                <p>If you provide an npub, your receipt will be sent as a DM to the relays provided below.</p>
                <p className="text-sm text-gray-500">Toggle the switch to use more secure NIP-17 messaging when supported. If you aren't sure whether the relay supports NIP-17, use NIP-04.</p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleAddRelay} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={newRelay}
                    onChange={(e) => setNewRelay(e.target.value)}
                    placeholder="wss://relay.example.com"
                    className="flex-1 p-2 bg-[var(--secondary-bg-color)] border border-gray-700 text-[var(--main-text-color)]"
                />
                <button
                    type="submit"
                    className="bg-blue-500 px-4 py-2 hover:font-bold text-[var(--main-text-color)] flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add
                </button>
            </form>

            <div className="space-y-2">
                {relayList.map((relay) => (
                    <div
                        key={relay}
                        className="flex justify-between items-center p-2 bg-[var(--secondary-bg-color)] border border-gray-700"
                    >
                        <div className="flex items-center gap-4">
                            <ProtocolToggle
                                isNip17={relayProtocols[relay] === 'nip17'}
                                onToggle={() => toggleProtocol(relay)}
                            />
                            <span className="font-mono text-sm">{relay}</span>
                        </div>
                        <button
                            onClick={() => removeRelay(relay)}
                            className="text-red-500 hover:text-red-600"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={resetRelays}
                className="flex items-center mt-6 ml-auto gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-sm"
                title="Reset to default relays"
            >
                <RotateCcw size={16} />
                Reset to Defaults
            </button>
        </div>
    );
}

const ProtocolToggle = ({ isNip17, onToggle }) => {
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={onToggle}
                className={`
                    relative w-12 h-6 rounded-full transition-colors duration-300
                    ${isNip17 ? 'bg-green-500' : 'bg-blue-500'}
                `}
            >
                <div
                    className={`
                        absolute top-1 left-1 w-4 h-4 rounded-full bg-white
                        transform transition-transform duration-300
                        ${isNip17 ? 'translate-x-6' : 'translate-x-0'}
                    `}
                >
                    {/* Security animation */}
                    {isNip17 && (
                        <div className="absolute inset-0 animate-ping">
                            <div className="absolute inset-0 rounded-full border-2 border-white opacity-75" />
                        </div>
                    )}
                </div>
            </button>
            <span className="text-sm">
                {isNip17 ? 'NIP-17 (More Secure)' : 'NIP-04'}
            </span>
        </div>
    );
};
