export interface UnloadMessage {
    type: "unload";
}

interface InitMessage {
    type: "init";
}

interface TwoWayMessage {
    type: "2way";
}

export interface AddChildStatusUpdateMessage {
    type: "status_update:add_child";
    parentId: string | undefined;
    childId: string;
}

export interface RemoveNodeStatusUpdateMessage {
    type: "status_update:remove_node";
    nodeId: string;
}

export interface SetChildrenStatusUpdateMessage {
    type: "status_update:set_children";
    parentId: string;
    childIds: readonly string[];
}

/**
 * P2B: Request that the children of the specified node are loaded.
 * Response is a `SetChildrenStatusUpdateMessage` with the `parentId` set to `nodeId`.
 */
export interface ChildrenRequestMessage {
    type: "children_req";
    nodeId: string;
}

/**
 * P2B: Request information about a specific node. The information returned depends on the type of node.
 * Response is a `NodeInfoMessage` with a matching `nodeId`.
 */
export interface InfoRequestMessage {
    type: "info_req";
    nodeId: string;
}

interface BaseNodeInfoMessage {
    type: "node_info";
    nodeId: string;
}

export interface NodeInfoMessage_HtmlElement extends BaseNodeInfoMessage {
    nodeType: "element";
    elementName: string;
    attributes: Record<string, string>;
}

export interface NodeInfoMessage_Text extends BaseNodeInfoMessage {
    nodeType: "text";
    textContent: string;
}

export interface NodeInfoMessage_Comment extends BaseNodeInfoMessage {
    nodeType: "comment";
    textContent: string;
}

export type NodeInfoMessage = NodeInfoMessage_HtmlElement | NodeInfoMessage_Text | NodeInfoMessage_Comment;

export type WebMessage =
    | UnloadMessage
    | InitMessage
    | TwoWayMessage
    | AddChildStatusUpdateMessage
    | RemoveNodeStatusUpdateMessage
    | SetChildrenStatusUpdateMessage
    | ChildrenRequestMessage
    | InfoRequestMessage
    | NodeInfoMessage;
