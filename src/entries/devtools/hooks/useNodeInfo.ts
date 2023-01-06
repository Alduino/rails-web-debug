import {useEffect, useState} from "react";
import {NodeInfo} from "../../shared/NodeInfo";
import {Node} from "../node-tree";

export default function useNodeInfo(node: Node) {
    const [nodeInfo, setNodeInfo] = useState<NodeInfo | null>(node.nodeInfo);

    useEffect(() => {
        node.loadNodeInfo();
        setNodeInfo(node.nodeInfo);
    }, [node]);

    useEffect(() => {
        return node.nodeInfoUpdated.listen(() => {
            setNodeInfo(node.nodeInfo);
        });
    }, [node]);

    return nodeInfo;
}
