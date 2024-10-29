/**
 * @typedef {Function} Listener
 * @typedef {Function} Unsubscriber
 * @typedef {{eventName: string, listener: Listener}} Subscription
 */

class EventBusState {
    constructor() {
        this.listeners = new Map();
        this.oneTimeListeners = new Set();
    }

    addListener(eventName, listener) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }
        this.listeners.get(eventName).add(listener);
    }

    removeListener(eventName, listener) {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).delete(listener);
            if (this.listeners.get(eventName).size === 0) {
                this.listeners.delete(eventName);
            }
        }
    }

    markAsOneTime(listener) {
        this.oneTimeListeners.add(listener);
    }

    removeOneTimeListener(listener) {
        this.oneTimeListeners.delete(listener);
    }
}

class EventBusCommands {
    constructor(state) {
        this.state = state;
    }

    /**
     * Subscribe to an event (Command)
     * @param {string} eventName
     * @param {Listener} listener
     * @returns {Unsubscriber}
     */
    subscribe(eventName, listener) {
        this.state.addListener(eventName, listener);
        return () => this.unsubscribe(eventName, listener);
    }

    /**
     * Subscribe to an event once (Command)
     * @param {string} eventName
     * @param {Listener} listener
     * @returns {Unsubscriber}
     */
    subscribeOnce(eventName, listener) {
        const wrappedListener = (...args) => {
            this.unsubscribe(eventName, wrappedListener);
            listener(...args);
        };
        this.state.markAsOneTime(wrappedListener);
        return this.subscribe(eventName, wrappedListener);
    }

    /**
     * Unsubscribe from an event (Command)
     * @param {string} eventName
     * @param {Listener} listener
     */
    unsubscribe(eventName, listener) {
        this.state.removeListener(eventName, listener);
        if (this.state.oneTimeListeners.has(listener)) {
            this.state.removeOneTimeListener(listener);
        }
    }

    /**
     * Remove all listeners for an event or all events (Command)
     * @param {string} [eventName]
     */
    removeAllListeners(eventName) {
        if (eventName) {
            if (this.state.listeners.has(eventName)) {
                this.state.listeners.get(eventName).clear();
                this.state.listeners.delete(eventName);
            }
        } else {
            this.state.listeners.clear();
            this.state.oneTimeListeners.clear();
        }
    }

    /**
     * Emit an event (Command)
     * @param {string} eventName
     * @param {...any} args
     */
    emit(eventName, ...args) {
        if (this.state.listeners.has(eventName)) {
            this.state.listeners.get(eventName).forEach(listener => {
                try {
                    listener(...args);
                } catch (error) {
                    console.error(`Error in event listener for ${eventName}:`, error);
                }
            });
        }
    }
}

class EventBusQueries {
    constructor(state) {
        this.state = state;
    }

    /**
     * Get number of listeners for an event (Query)
     * @param {string} eventName
     * @returns {number}
     */
    getListenerCount(eventName) {
        return this.state.listeners.has(eventName)
            ? this.state.listeners.get(eventName).size
            : 0;
    }

    /**
     * Check if event has listeners (Query)
     * @param {string} eventName
     * @returns {boolean}
     */
    hasListeners(eventName) {
        return this.state.listeners.has(eventName) &&
            this.state.listeners.get(eventName).size > 0;
    }

    /**
     * Get all event names (Query)
     * @returns {string[]}
     */
    getEventNames() {
        return Array.from(this.state.listeners.keys());
    }
}

class EventBus {
    constructor() {
        const state = new EventBusState();
        this.commands = new EventBusCommands(state);
        this.queries = new EventBusQueries(state);
    }

    // Command methods
    subscribe(eventName, listener) {
        return this.commands.subscribe(eventName, listener);
    }

    subscribeOnce(eventName, listener) {
        return this.commands.subscribeOnce(eventName, listener);
    }

    unsubscribe(eventName, listener) {
        this.commands.unsubscribe(eventName, listener);
    }

    removeAllListeners(eventName) {
        this.commands.removeAllListeners(eventName);
    }

    emit(eventName, ...args) {
        this.commands.emit(eventName, ...args);
    }

    // Query methods
    getListenerCount(eventName) {
        return this.queries.getListenerCount(eventName);
    }

    hasListeners(eventName) {
        return this.queries.hasListeners(eventName);
    }

    getEventNames() {
        return this.queries.getEventNames();
    }
}

const eventBus = Object.freeze(new EventBus());

module.exports = { eventBus };
