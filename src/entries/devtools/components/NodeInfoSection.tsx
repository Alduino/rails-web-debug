import {containerStyle, nameStyle} from "./NodeInfoItem.css";
import {JsonObject} from "./json/JsonObject";
import RecursiveRecord from "../utils/RecursiveRecord";

export interface NodeInfoSection {
    name: string;
    value: RecursiveRecord;
}

export function NodeInfoSection({name, value}: NodeInfoSection) {
    return (
        <div className={containerStyle}>
            <div className={nameStyle}>{name}</div>
            <JsonObject value={value}/>
        </div>
    )
}
