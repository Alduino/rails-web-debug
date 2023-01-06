import {ReactElement} from "react";
import {containerStyle} from "./NodeInfoSidebar.css";
import {useActiveNode} from "../hooks/active-node";
import useNodeInfo from "../hooks/useNodeInfo";
import {NodeInfoSection} from "./NodeInfoSection";
import {NodeInfo} from "../../shared/NodeInfo";

function createNodeInfoObject(nodeInfo: NodeInfo) {
    if (nodeInfo.type === "element") {
        return {
            type: "html element"
        };
    } else if (nodeInfo.type === "text") {
        return {
            type: "inline-text"
        }
    } else if (nodeInfo.type === "comment") {
        return {
            type: "comment"
        }
    } else if (nodeInfo.type === "partial") {
        return {
            type: "rails partial"
        }
    }
}

export function NodeInfoSidebar(): ReactElement {
    const activeNode = useActiveNode();
    const nodeInfo = useNodeInfo(activeNode);
    if (!nodeInfo) return null;

    const nodeInfoObject = createNodeInfoObject(nodeInfo);

    return (
        <div className={containerStyle}>
            <NodeInfoSection name="node" value={nodeInfoObject} />

            {nodeInfo.type === "element" && (
                <NodeInfoSection name="element" value={{
                    kind: nodeInfo.elementName.toLowerCase(),
                    attributes: Object.fromEntries(nodeInfo.attributes)
                }} />
            )}

            {nodeInfo.type === "text" && (
                <NodeInfoSection name="text" value={{
                    text: nodeInfo.text
                }} />
            )}

            {nodeInfo.type === "comment" && (
                <NodeInfoSection name="comment" value={{
                    text: nodeInfo.text
                }} />
            )}

            {nodeInfo.type === "partial" && (
                <NodeInfoSection name="partial" value={{
                    name: nodeInfo.name,
                    folder: nodeInfo.path
                }} />
            )}

            <NodeInfoSection name="rwd" value={{
                id: activeNode.nodeId,
                children: activeNode.children ? activeNode.children.size : "unloaded"
            }} />
        </div>
    )
}
