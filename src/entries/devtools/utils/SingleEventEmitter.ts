type EventHandler<Args extends unknown[]> = (...args: Args) => void;

export interface SingleEventListener<Args extends unknown[]> {
    /**
     * Adds a listener to the event. Returns a function that removes the listener.
     */
    listen(handler: EventHandler<Args>): () => void;
}

export default class SingleEventEmitter<Args extends unknown[] = []> implements SingleEventListener<Args> {
    readonly #handlers = new Set<EventHandler<Args>>();
    #lastArgs: Args | null = null;

    static get noopListener(): SingleEventListener<[]> {
        return new SingleEventEmitter();
    }

    getListener(): SingleEventListener<Args> {
        return this;
    }

    listen(handler: EventHandler<Args>) {
        this.#handlers.add(handler);
        return () => this.#handlers.delete(handler);
    }

    emit(...args: Args) {
        this.#lastArgs = args;
        this.#runHandlers();
    }

    #runHandlers() {
        this.#handlers.forEach(handler => handler(...this.#lastArgs));
    }
}
