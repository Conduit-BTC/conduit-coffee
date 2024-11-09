// context/NostrContext.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_RELAYS = [
    "wss://relay.conduit.coffee",
    "wss://relay.primal.net",
    // "wss://relay.damus.io",
    // "wss://strfry.iris.to"
];

export const useNostrContext = create(
    persist(
        (set) => ({
            relayList: DEFAULT_RELAYS,
            addRelay: (relay) =>
                set((state) => ({
                    relayList: [...new Set([...state.relayList, relay])]
                })),
            removeRelay: (relay) =>
                set((state) => ({
                    relayList: state.relayList.filter(r => r !== relay)
                })),
            resetRelays: () =>
                set({ relayList: DEFAULT_RELAYS }),

            // Could add other Nostr-related state here, such as:
            // - Connected relay status
            // - Current npub/keys
            // - Connection status
            // etc.
        }),
        {
            name: 'nostr-storage',
            partialize: (state) => ({
                relayList: state.relayList,
            }),
        }
    )
);
