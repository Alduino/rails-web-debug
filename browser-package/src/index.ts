import Association from "./Association";
import {connect, listenForExtensionMessage, postExtensionMessage} from "./messaging";

const knownNodes = new Association<string, Node>();

function createUuid() {
    return crypto.randomUUID();
}

function deleteNode(node: Node) {
    if (!knownNodes.hasB(node)) return;

    const id = knownNodes.getFromB(node);
    knownNodes.deleteFromA(id);

    postExtensionMessage({
        type: "status_update:remove_node",
        nodeId: id
    });
}

function registerNode(node: Node, postMessage = true): string | undefined {
    if (node === document.documentElement) {
        return undefined;
    }

    if (knownNodes.hasB(node)) return knownNodes.getFromB(node);

    const nodeId = createUuid();
    knownNodes.add(nodeId, node);

    const parentNodeId = registerNode(node.parentNode);

    if (postMessage) {
        postExtensionMessage({
            type: "status_update:add_child",
            parentId: parentNodeId,
            childId: nodeId
        });
    }

    return nodeId;
}

function registerGlobalMutationObserver() {
    const observer = new MutationObserver(events => {
        try {
            for (const event of events) {
                const removedNodes = Array.from(event.removedNodes);
                const addedNodes = Array.from(event.addedNodes);

                for (const node of removedNodes) {
                    deleteNode(node);
                }

                for (const node of addedNodes) {
                    registerNode(node);
                }
            }
        } catch (err) {
            console.error(err);
        }
    });

    observer.observe(document.documentElement, {
        subtree: true,
        childList: true
    });

    window.__rwd_cleanup.push(() => observer.disconnect());
}

function registerNodeInfoHandler() {
    const unlisten = listenForExtensionMessage("info_req", request => {
        const {nodeId} = request;
        const node = nodeId ? knownNodes.getFromA(nodeId) : document.documentElement;
        if (!node) throw new Error(`Invalid node id, ${nodeId}`);

        if (node.nodeType === Node.ELEMENT_NODE) {
            postExtensionMessage({
                type: "node_info",
                nodeId,
                nodeType: "element",
                elementName: node.nodeName,
                attributes: Object.fromEntries(
                    Array.from((node as Element).attributes).map(attr => [attr.name, attr.value])
                )
            });
        } else if (node.nodeType === Node.TEXT_NODE) {
            postExtensionMessage({
                type: "node_info",
                nodeId,
                nodeType: "text",
                textContent: node.textContent
            });
        } else if (node.nodeType === Node.COMMENT_NODE) {
            postExtensionMessage({
                type: "node_info",
                nodeId,
                nodeType: "comment",
                textContent: node.textContent
            });
        }
    });
    window.__rwd_cleanup.push(unlisten);
}

function registerNodeChildrenHandler() {
    const unlisten = listenForExtensionMessage("children_req", request => {
        const {nodeId} = request;
        const node = nodeId ? knownNodes.getFromA(nodeId) : document.documentElement;
        if (!node) throw new Error(`Invalid node id, ${nodeId}`);

        const nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT);

        const nodes: Node[] = [];
        const nodeIds: string[] = [];

        let currentNode: Node | null = null;

        while ((currentNode = nodeIterator.nextNode()) !== null) {
            if (currentNode === node) continue;

            if (nodes.some(node => node.contains(currentNode))) {
                // ignore children
                continue;
            }

            if (currentNode.nodeType === Node.TEXT_NODE && !currentNode.textContent.trim()) {
                continue;
            }

            nodes.push(currentNode);
            nodeIds.push(registerNode(currentNode, false));
        }

        postExtensionMessage({
            type: "status_update:set_children",
            parentId: nodeId,
            childIds: nodeIds
        });
    });
    window.__rwd_cleanup.push(unlisten);
}

function registerReloadHandler() {
    const listener = () => {
        postExtensionMessage({
            type: "unload"
        });
    };

    addEventListener("beforeunload", listener);
    window.__rwd_cleanup.push(() => removeEventListener("beforeunload", listener));
}

declare global {
    interface Window {
        __rwd_cleanup: (() => void)[];
    }
}

try {
    window.__rwd_cleanup?.forEach(el => el());
    window.__rwd_cleanup = [];

    window.__rwd_cleanup.push(connect());

    registerGlobalMutationObserver();
    registerNodeInfoHandler();
    registerNodeChildrenHandler();
    registerReloadHandler();

    window.__rwd_cleanup.push(listenForExtensionMessage("2way", () => {
        postExtensionMessage({type: "init"});
    }));
} catch (err) {
    console.error(err);
}
