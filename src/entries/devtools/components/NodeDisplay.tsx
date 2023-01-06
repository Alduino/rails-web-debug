import {ReactElement, useState} from "react";
import {NodeDisplayChildren} from "./NodeDisplayChildren";
import useNodeInfo from "../hooks/useNodeInfo";
import {expandIconStyle, indentLevelVar, nodeTypeLabel, titleContainerStyle} from "./NodeDisplay.css";
import {CaretDownFill, CaretRightFill} from "react-bootstrap-icons";
import {useActiveNode, useActiveNodeSetter} from "../hooks/active-node";
import {assignInlineVars} from "@vanilla-extract/dynamic";
import {Node} from "../node-tree";
import useChildNodes from "../hooks/useChildNodes";

export interface NodeDisplayProps {
    node: Node;
    indentLevel?: number;
    isActiveTree?: boolean;
}

export function NodeDisplay({node, indentLevel = 0, isActiveTree}: NodeDisplayProps): ReactElement {
    const [open, setOpen] = useState(false);
    const nodeInfo = useNodeInfo(node);
    const children = useChildNodes(node, false);
    const setActiveNode = useActiveNodeSetter();
    const activeNode = useActiveNode();

    return (
        <>
            <div className={titleContainerStyle({
                loaded: nodeInfo !== null,
                isActiveNode: activeNode === node,
                noChildren: children && children.size === 0,
                isActiveTree
            })} style={assignInlineVars({
                [indentLevelVar]: indentLevel.toString()
            })} onClick={() => setActiveNode(node)}>
                {(!children || children.size > 0) && (
                    <div className={expandIconStyle} onClick={() => setOpen(prev => !prev)}>
                        {open ? (
                            <CaretDownFill/>
                        ) : (
                            <CaretRightFill/>
                        )}
                    </div>
                )}

                <span>
                    {nodeInfo && (
                        nodeInfo.type === "element"
                            ? `<${nodeInfo.elementName.toLowerCase()}>`
                            : nodeInfo.type === "text"
                                ? nodeInfo.text
                                : nodeInfo.type === "comment"
                                    ? "<!--" + nodeInfo.text + "-->"
                                    : `render ${nodeInfo.name}`
                    )}
                </span>

                <div className={nodeTypeLabel}>
                    {nodeInfo && nodeInfo.type}
                </div>
            </div>
            {open && <NodeDisplayChildren
                node={node}
                indentLevel={indentLevel + 1}
                isActiveTree={isActiveTree || activeNode === node}/>}
        </>
    )
}
