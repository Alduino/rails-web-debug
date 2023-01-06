import {ReactElement} from "react";
import {NodeDisplay} from "./components/NodeDisplay";
import {themeClass} from "./theme.css";
import cx from "./utils/cx";
import {appStyle, nodesContainerStyle} from "./App.css";
import {NodeInfoSidebar} from "./components/NodeInfoSidebar";
import {useActiveNode} from "./hooks/active-node";
import {useRootNodeLoader} from "./hooks/node-tree";

export function App(): ReactElement {
    const hasActiveNode = useActiveNode() !== null;
    const rootNodeLoader = useRootNodeLoader();
    const rootNode = rootNodeLoader.getRootNode();

    return (
        <div className={cx(themeClass, appStyle)}>
            <div className={nodesContainerStyle}>
                <NodeDisplay node={rootNode}/>
            </div>
            {hasActiveNode && <NodeInfoSidebar/>}
        </div>
    )
}
