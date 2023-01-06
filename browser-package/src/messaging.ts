import {Runtime, runtime} from "webextension-polyfill";
import {WebMessage} from "../../src/entries/shared/WebMessage";

let port: Runtime.Port;

export function connect() {
    port = runtime.connect({
        name: "browser-package"
    });

    port.onMessage.addListener((msg: WebMessage) => {
        const listenerList = listeners.get(msg.type);
        if (!listenerList) return;

        for (const listener of listenerList) {
            listener(msg);
        }
    });

    return () => port.disconnect();
}

const listeners = new Map<WebMessage["type"], Set<(message: WebMessage) => void>>();

export function postExtensionMessage(message: WebMessage) {
    port.postMessage(message);
}

export function listenForExtensionMessage<Type extends WebMessage["type"]>(type: Type, handler: (message: WebMessage & { type: Type }) => void) {
    const set = new Set<(message: WebMessage) => void>();
    const listenerList = listeners.get(type) ?? set;
    listenerList.add(handler);
    if (listenerList === set) listeners.set(type, set);
    return () => listenerList.delete(handler);
}
