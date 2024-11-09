// layouts/RelayPoolEditorLayout.jsx
import React, { useState } from 'react';
import { X, Plus, RotateCcw } from 'lucide-react';
import { useNostrContext } from '../../context/NostrContext';

export default function RelayPoolEditorLayout() {
    const { relayList, addRelay, removeRelay, resetRelays } = useNostrContext();
    const [newRelay, setNewRelay] = useState('');

    const handleAddRelay = (e) => {
        e.preventDefault();
        if (newRelay && !relayList.includes(newRelay)) {
            addRelay(newRelay);
            setNewRelay('');
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col items-start mb-6 gap-2">
                <h2 className="text-xl text-blue-500">Nostr Relay Pool Editor</h2>
                <p>If you provide an npub, youur receipt will be sent as a <a href="https://nips.nostr.com/17" target="_blank">NIP-17 Private Direct Message</a> to the provided npub, signed by our Nostr Receipt Generator, and posted to the following relays: </p>
            </div>

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
                        <span className="font-mono text-sm">{relay}</span>
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
        </div >
    );
}
