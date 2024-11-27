// NostrContext.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_RELAYS = [
    "ws://localhost:3355"
];

export const useNostrContext = create(
    persist(
        (set) => ({
            relayList: DEFAULT_RELAYS,
            relayProtocols: DEFAULT_RELAYS.reduce((acc, relay) => ({
                ...acc,
                [relay]: 'nip04'
            }), {}),
            isLoading: false,
            error: null,
            addRelay: (relay) =>
                set((state) => ({
                    relayList: [...new Set([...state.relayList, relay])],
                    relayProtocols: {
                        ...state.relayProtocols,
                        [relay]: 'nip04' // Default to NIP-04
                    }
                })),
            removeRelay: (relay) =>
                set((state) => {
                    const { [relay]: _, ...remainingProtocols } = state.relayProtocols;
                    return {
                        relayList: state.relayList.filter(r => r !== relay),
                        relayProtocols: remainingProtocols
                    };
                }),
            toggleProtocol: (relay) =>
                set((state) => ({
                    relayProtocols: {
                        ...state.relayProtocols,
                        [relay]: state.relayProtocols[relay] === 'nip04' ? 'nip17' : 'nip04'
                    }
                })),
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            resetRelays: () =>
                set({
                    relayList: DEFAULT_RELAYS,
                    relayProtocols: DEFAULT_RELAYS.reduce((acc, relay) => ({
                        ...acc,
                        [relay]: 'nip04'
                    }), {})
                }),
            setRelayPool: (relayPool) =>
                set({
                    relayList: relayPool.relays,
                    relayProtocols: relayPool.protocols ||
                        relayPool.relays.reduce((acc, relay) => ({
                            ...acc,
                            [relay]: 'nip04'
                        }), {})
                })
        }),
        {
            name: 'nostr-storage',
            partialize: (state) => ({
                relayList: state.relayList,
                relayProtocols: state.relayProtocols,
            }),
        }
    )
);
