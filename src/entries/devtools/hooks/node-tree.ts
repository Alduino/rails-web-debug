import {createContext, useContext} from "react";
import {RootNodeLoader} from "../node-tree";

const context = createContext<RootNodeLoader | null>(null);

export function useRootNodeLoader() {
    const result = useContext(context);
    if (!result) throw new Error("Missing provider");
    return result;
}

export const NodeTreeProvider = context.Provider;
