import {useEffect, useState} from "react";
import {Node} from "../node-tree";

export default function useChildNodes(parentNode: Node, requestChildren = true) {
    const [childNodes, setChildNodes] = useState<ReadonlySet<Node> | null>(parentNode.children);

    useEffect(() => {
        if (!requestChildren) return;
        parentNode.loadChildren();
    }, [parentNode, requestChildren]);

    useEffect(() => {
        return parentNode.childrenUpdated.listen(() => {
            setChildNodes(parentNode.children);
        });
    }, [parentNode]);

    return childNodes;
}
