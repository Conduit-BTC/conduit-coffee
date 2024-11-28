import { useState } from 'react';
import { Plus, RotateCcw, Loader2 } from 'lucide-react';
import { useNostrContext } from '../../context/NostrContext';
import RelayItem from '../../components/RelayItem';

export default function RelayPoolEditorLayout({ npub }) {
    const {
        relayList,
        addRelay,
        removeRelay,
        resetRelays,
        toggleProtocol,
        isLoading,
        error,
    } = useNostrContext();
    const [newRelay, setNewRelay] = useState('');

    const handleAddRelay = (e) => {
        e.preventDefault();
        if (newRelay && !relayList.some(r => r.url === newRelay)) {
            addRelay({
                url: newRelay,
                protocol: 'NIP-04'
            });
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
        <div className="relative flex flex-col bg-[#1a1b26]/80 rounded-lg">
            <h5>2. Select Relays</h5>
            <div className="flex items-start gap-2 text-sm text-gray-400 mt-4">
                <div className="text-yellow-400 mt-1">○</div>
                <span>Enable NIP-17 for enhanced security, when supported by the relay.</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-400 mb-4">
                <div className="text-red-400 mt-1">○</div>
                <span>Not sure if your client + relay supports NIP-17? Use NIP-04</span>
            </div>
            {/* Reset Button */}
            <div className="flex justify-end mb-2">
                <button
                    onClick={resetRelays}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 hover:bg-gray-700/50
                   rounded border border-gray-600/30 transition-colors duration-200"
                >
                    <RotateCcw size={16} className="text-gray-400" />
                    <span className="font-mono text-sm text-gray-400">Reset</span>
                </button>
            </div>
            {/* Relay List */}
            <div className="flex-1 space-y-3 mb-6">
                {relayList.map((relay, i) => (
                    <RelayItem
                        key={'relay-' + i}
                        relay={relay}
                        isNip17={relay.protocol === 'NIP-17'}
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

            <div className="flex flex-col gap-3 mb-6 p-4">
                <h6>Add a Relay (optional):</h6>
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
                    className="w-full bg-green-600 hover:bg-green-500 rounded-lg py-3
                   font-mono text-white text-sm flex items-center justify-center gap-2
                   transition-colors duration-200"
                >
                    <Plus size={18} />
                    Add Relay
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
