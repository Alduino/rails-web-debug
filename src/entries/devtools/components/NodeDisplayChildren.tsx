import {ReactElement} from "react";
import useChildNodes from "../hooks/useChildNodes";
import {NodeDisplay} from "./NodeDisplay";
import {listItemStyle} from "./NodeDisplayChildren.css";
import {Node} from "../node-tree";

export interface NodeDisplayChildrenProps {
    node: Node;
    indentLevel: number;
    isActiveTree: boolean;
}

export function NodeDisplayChildren({node, indentLevel, isActiveTree}: NodeDisplayChildrenProps): ReactElement {
    const children = useChildNodes(node);

    if (children) {
        return (
            <>
                {Array.from(children).map(node => (
                    <div className={listItemStyle} key={node.nodeId}>
                        <NodeDisplay key={node.nodeId} node={node} indentLevel={indentLevel}
                                     isActiveTree={isActiveTree}/>
                    </div>
                ))}
            </>
        );
    } else {
        return null;
    }
}
