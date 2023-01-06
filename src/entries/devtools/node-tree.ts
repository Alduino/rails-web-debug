import SingleEventEmitter, {SingleEventListener} from "./utils/SingleEventEmitter";
import {Runtime} from "webextension-polyfill";
import {NodeInfoMessage, WebMessage} from "../shared/WebMessage";
import {NodeInfo, RailsPartialNodeInfo} from "../shared/NodeInfo";

interface ParentInterface {
    requestChildren(nodeId: string): void;

    requestNodeInfo(nodeId: string): void;
}

const emptySet = new Set<InnerNode>();

export interface Node {
    get nodeId(): string | undefined;

    get children(): ReadonlySet<Node> | null;

    get nodeInfo(): NodeInfo | null;

    get childrenUpdated(): SingleEventListener<[]>;

    get nodeInfoUpdated(): SingleEventListener<[]>;

    loadChildren(): void;

    loadNodeInfo(): void;
}

class FakeNode implements Node {
    readonly #fakeId = crypto.randomUUID();
    readonly #children = new Set<Node>();

    constructor(private parent: Node, readonly nodeInfo: NodeInfo, readonly parentNode: FakeNode | undefined) {
    }

    get childrenUpdated() {
        return this.parent.childrenUpdated;
    }

    get nodeInfoUpdated() {
        return SingleEventEmitter.noopListener;
    }

    get children(): Set<Node> | null {
        return this.#children;
    }

    get nodeId(): string | undefined {
        return `fake:${this.#fakeId}`;
    }

    loadChildren(): void {
        this.parent.loadChildren();
    }

    loadNodeInfo(): void {
        // noop
    }
}

function createPartialNodeInfo(path: string): RailsPartialNodeInfo {
    const [, , ...pathInViews] = path.split("/");
    const filePath = pathInViews.slice(0, pathInViews.length - 1).join("/");
    const fileName = pathInViews.at(-1);

    const partialName = fileName.replace(/(?:\.[a-z]+){1,2}$/, "");

    return {
        type: "partial",
        fullPath: path,
        name: partialName,
        path: filePath
    };
}

class InnerNode implements Node {
    readonly #parent: ParentInterface;

    readonly #nodeId: string;

    #children: Set<InnerNode> | null;

    #nodeInfo: NodeInfo | null;

    #childrenUpdatedEvent = new SingleEventEmitter();
    #nodeInfoUpdatedEvent = new SingleEventEmitter();

    constructor(id: string, parent: ParentInterface) {
        this.#nodeId = id;
        this.#parent = parent;
    }

    get childrenUpdated() {
        return this.#childrenUpdatedEvent.getListener();
    }

    get nodeInfoUpdated() {
        return this.#nodeInfoUpdatedEvent.getListener();
    }

    get nodeId() {
        return this.#nodeId;
    }

    get children(): ReadonlySet<Node> | null {
        if (!this.#children) return this.#children;

        const children = Array.from(this.#children);
        if (!children.some(child => child.nodeInfo?.type === "comment")) return this.#children;

        let currentPartialNode: FakeNode | null = null;
        const outputNodes = new Set<Node>();

        for (const node of children) {
            if (!node.nodeInfo) {
                (currentPartialNode?.children ?? outputNodes).add(node);
                continue;
            }

            if (node.nodeInfo.type === "comment") {
                const commentMessage = node.nodeInfo.text;

                if (commentMessage.startsWith(" BEGIN ")) {
                    const path = commentMessage.substring(" BEGIN ".length).trim();
                    const nodeInfo = createPartialNodeInfo(path);
                    const fakeNode = new FakeNode(currentPartialNode ?? this, nodeInfo, currentPartialNode);

                    (currentPartialNode?.children ?? outputNodes).add(fakeNode);
                    currentPartialNode = fakeNode;
                } else if (commentMessage.startsWith(" END ")) {
                    currentPartialNode = currentPartialNode.parentNode;
                } else {
                    (currentPartialNode?.children ?? outputNodes).add(node);
                }
            } else {
                (currentPartialNode?.children ?? outputNodes).add(node);
            }
        }

        return outputNodes;
    }

    get nodeInfo(): NodeInfo | null {
        return this.#nodeInfo;
    }

    private get childrenOrEmpty() {
        return this.#children ?? emptySet;
    }

    loadChildren() {
        if (this.children) return;
        this.#parent.requestChildren(this.#nodeId);
    }

    loadNodeInfo() {
        if (this.nodeInfo) return;
        this.#parent.requestNodeInfo(this.#nodeId);
    }

    onNodeDeleted(nodeId: string) {
        for (const child of this.childrenOrEmpty) {
            if (child.nodeId !== nodeId) continue;

            this.childrenOrEmpty.delete(child);
            this.#childrenUpdatedEvent.emit();
        }

        for (const child of this.childrenOrEmpty) {
            child.onNodeDeleted(nodeId);
        }
    }

    onNodeAdded(parentId: string, childId: string) {
        if (parentId !== this.nodeId) {
            for (const child of this.childrenOrEmpty) {
                child.onNodeAdded(parentId, childId);
            }
        } else {
            const node = new InnerNode(childId, this.#parent);
            this.childrenOrEmpty.add(node);
        }
    }

    onChildrenReplaced(parentId: string, childIds: readonly string[]) {
        if (parentId !== this.nodeId) {
            for (const child of this.childrenOrEmpty) {
                child.onChildrenReplaced(parentId, childIds);
            }
        } else {
            this.#children = new Set(childIds.map(childId => new InnerNode(childId, this.#parent)));
            this.#childrenUpdatedEvent.emit();
        }
    }

    onNodeInfoUpdated(nodeId: string, nodeInfo: NodeInfo) {
        if (nodeId !== this.nodeId) {
            for (const child of this.childrenOrEmpty) {
                child.onNodeInfoUpdated(nodeId, nodeInfo);

                if (nodeId === child.nodeId && nodeInfo.type === "comment") {
                    const {text} = nodeInfo;

                    if (text.startsWith(" BEGIN ") || text.startsWith(" END ")) {
                        this.#childrenUpdatedEvent.emit();
                    }
                }
            }
        } else {
            this.#nodeInfo = nodeInfo;
            this.#nodeInfoUpdatedEvent.emit();
        }
    }
}

function createNodeInfo(message: NodeInfoMessage): NodeInfo {
    switch (message.nodeType) {
        case "element":
            return {
                type: "element",
                elementName: message.elementName,
                attributes: Object.entries(message.attributes)
            };
        case "text":
            return {type: "text", text: message.textContent};
        case "comment":
            return {type: "comment", text: message.textContent};
    }
}

export class RootNodeLoader {
    readonly #port: Runtime.Port;
    readonly #parentInterface: ParentInterface;
    readonly #rootNode: InnerNode;

    constructor(port: Runtime.Port) {
        this.#port = port;

        this.#parentInterface = this.#createParentInterface();

        this.#rootNode = new InnerNode(undefined, this.#parentInterface);

        port.onMessage.addListener(message => this.#handleMessage(message));
    }

    getRootNode(): Node {
        return this.#rootNode;
    }

    #createParentInterface(): ParentInterface {
        return {
            requestChildren: nodeId => {
                this.#post({
                    type: "children_req",
                    nodeId
                });
            },
            requestNodeInfo: nodeId => {
                this.#post({
                    type: "info_req",
                    nodeId
                });
            }
        };
    }

    #post(message: WebMessage) {
        this.#port.postMessage(message);
    }

    #handleMessage(message: WebMessage) {
        switch (message.type) {
            case "status_update:remove_node":
                this.#rootNode.onNodeDeleted(message.nodeId);
                break;
            case "status_update:add_child":
                this.#rootNode.onNodeAdded(message.parentId, message.childId);
                break;
            case "status_update:set_children":
                this.#rootNode.onChildrenReplaced(message.parentId, message.childIds);
                break;
            case "node_info":
                this.#rootNode.onNodeInfoUpdated(message.nodeId, createNodeInfo(message))
                break;
            default:
                throw new Error(`Unknown message type, ${message.type}`);
        }
    }
}
