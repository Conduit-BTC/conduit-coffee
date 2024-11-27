import { useState, useEffect } from 'react';
import { Plus, RotateCcw, Loader2 } from 'lucide-react';
import { useNostrContext } from '../../context/NostrContext';
import RelayItem from '../../components/RelayItem';

export default function RelayPoolEditorLayout({ npub }) {
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
            if (!npub || npub.length < 60) return;
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/nostr/npub/${npub}/relaypool`);
                if (!response.ok && response.status !== 404) {
                    throw new Error('Failed to fetch relay pool');
                }
                if (response.ok) {
                    const data = await response.json();
                    setRelayPool(data.data);
                }
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
            <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-[#1a1b26]/80 rounded-lg">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-3" />
                <span className="text-blue-400 font-mono tracking-wider animate-pulse">
                    INITIALIZING RELAY POOL...
                </span>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col bg-[#1a1b26]/80 rounded-lg p-4">
            {/* Add Relay Form */}
            <div className="flex flex-col gap-3 mb-6">
                <input
                    type="text"
                    value={newRelay}
                    onChange={(e) => setNewRelay(e.target.value)}
                    placeholder="wss://relay.example.com"
                    className="w-full px-4 py-2 bg-black/30 border border-gray-700/50 rounded-lg
                   text-gray-300 font-mono placeholder:text-gray-600 text-sm
                   focus:outline-none focus:border-blue-500/50"
                />
                <button
                    onClick={handleAddRelay}
                    className="w-full bg-blue-600 hover:bg-blue-500 rounded-lg py-3
                   font-mono text-white text-sm flex items-center justify-center gap-2
                   transition-colors duration-200"
                >
                    <Plus size={18} />
                    Add Relay
                </button>
            </div>

            {/* Relay List */}
            <div className="flex-1 space-y-3 mb-6">
                {relayList.map((relay, i) => (
                    <RelayItem
                        key={'relay-' + i}
                        relay={relay}
                        isNip17={relayProtocols[relay] === 'nip17' ? true : false}
                        onToggle={() => toggleProtocol(relay)}
                        onRemove={() => removeRelay(relay)}
                    />
                ))}

                {relayList.length === 0 && (
                    <div className="py-8 text-center text-gray-500 font-mono text-sm">
                        No relays configured. Add one to get started.
                    </div>
                )}
            </div>

            {/* Reset Button - Fixed at Bottom */}
            <div className="flex justify-end mt-auto pt-4 border-t border-gray-800/30">
                <button
                    onClick={resetRelays}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 hover:bg-gray-700/50
                   rounded border border-gray-600/30 transition-colors duration-200"
                >
                    <RotateCcw size={16} className="text-gray-400" />
                    <span className="font-mono text-sm text-gray-400">Reset</span>
                </button>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="absolute bottom-16 left-4 right-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 font-mono text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}
