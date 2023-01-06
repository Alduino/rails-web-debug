export interface ElementNodeInfo {
    type: "element";
    elementName: string;
    attributes: readonly [string, string][];
}

export interface TextNodeInfo {
    type: "text";
    text: string;
}

export interface CommentNodeInfo {
    type: "comment";
    text: string;
}

export interface RailsPartialNodeInfo {
    type: "partial";
    fullPath: string;
    name: string;
    path: string;
}

export type NodeInfo = ElementNodeInfo | TextNodeInfo | CommentNodeInfo | RailsPartialNodeInfo;
