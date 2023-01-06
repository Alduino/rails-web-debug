import {createContext, ReactElement, useContext, useMemo, useState} from "react";
import {Node} from "../node-tree";

interface Context {
    node: Node | null;

    setNode(node: Node | null): void;
}

const context = createContext<Context>(null);

function useActiveNodeContext() {
    const result = useContext(context);
    if (!result) throw new Error("Missing provider");
    return result;
}

export function useActiveNodeSetter() {
    return useActiveNodeContext().setNode;
}

export function useActiveNode() {
    return useActiveNodeContext().node;
}

export interface ActiveNodeProviderProps {
    children?: ReactElement;
}

export function ActiveNodeProvider({children}: ActiveNodeProviderProps) {
    const [nodeId, setNode] = useState<Context["node"]>(null);

    const contextValue = useMemo<Context>(() => ({
        node: nodeId,
        setNode
    }), [nodeId]);

    return (
        <context.Provider value={contextValue}>
            {children}
        </context.Provider>
    )
}
