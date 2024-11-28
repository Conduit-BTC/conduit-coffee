import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_RELAYS = [
    {
        url: 'wss://relay.primal.net',
        protocol: 'NIP-04'
    }
];

export const useNostrContext = create(
    persist(
        (set) => ({
            relayList: DEFAULT_RELAYS,
            isLoading: false,
            error: null,
            addRelay: (relay) =>
                set((state) => ({
                    relayList: [...state.relayList, relay]
                })),
            removeRelay: (relay) =>
                set((state) => ({
                    relayList: state.relayList.filter(r => r.url !== relay.url)
                })),
            toggleProtocol: (relay) =>
                set((state) => ({
                    relayList: state.relayList.map(r =>
                        r.url === relay.url
                            ? { ...r, protocol: r.protocol === 'NIP-04' ? 'NIP-17' : 'NIP-04' }
                            : r
                    )
                })),
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            resetRelays: () => set({ relayList: DEFAULT_RELAYS }),
            setRelayPool: (relayPool) => set({ relayList: relayPool })
        }),
        {
            name: 'nostr-storage',
            partialize: (state) => ({
                relayList: state.relayList,
            }),
        }
    )
);
