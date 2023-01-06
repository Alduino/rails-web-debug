import {createContext, useContext} from "react";
import {Runtime} from "webextension-polyfill";

const context = createContext<Runtime.Port | null>(null);

export function useMessagingPort() {
    const port = useContext(context);
    if (!port) throw new Error("Missing port");
    return port;
}

export const MessagingPortProvider = context.Provider;
