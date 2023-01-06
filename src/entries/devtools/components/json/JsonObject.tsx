import {ReactElement, useCallback, useMemo, useState} from "react";
import {
    copyButtonStyle,
    expandIconStyle,
    itemChildrenContainerStyle,
    itemContainerStyle,
    keyStyle, noEntriesMessageStyle,
    objectContainerStyle,
    valueStyle
} from "./JsonObject.css";
import {CaretDownFill, CaretRightFill, Clipboard} from "react-bootstrap-icons";
import RecursiveRecord from "../../utils/RecursiveRecord";
import cx from "../../utils/cx";

interface JsonObjectItemProps {
    name: string;
    value: RecursiveRecord[string];
}

function JsonObjectItem({name, value}: JsonObjectItemProps): ReactElement {
    const [isOpen, setOpen] = useState(false);
    const canOpen = typeof value === "object";

    const copy = useCallback(() => {
        navigator.clipboard.writeText(JSON.stringify(value));
    }, [value]);

    return (
        <>
            <li className={cx([itemContainerStyle({hasArrow: canOpen}), "json-object-item"])}>
                {canOpen && (
                    <div className={expandIconStyle} onClick={() => setOpen(prev => !prev)}>
                        {isOpen ? (
                            <CaretDownFill/>
                        ) : (
                            <CaretRightFill/>
                        )}
                    </div>
                )}

                <div className={keyStyle}>{name}</div>
                <div className={valueStyle}>{canOpen ? `${Object.keys(value).length} keys` : JSON.stringify(value)}</div>

                <div className={copyButtonStyle} title="Copy JSON">
                    <Clipboard onClick={copy} />
                </div>
            </li>
            {isOpen && (
                <li className={itemChildrenContainerStyle}>
                    <JsonObject value={value as RecursiveRecord} />
                </li>
            )}
        </>
    )
}

export interface JsonObjectProps {
    value: RecursiveRecord;
}

export function JsonObject({value}: JsonObjectProps): ReactElement {

    const entries = useMemo(() => Object.entries(value), [value]);

    return (
        <ul className={objectContainerStyle}>
            {entries.map(([key, value]) => (
                <JsonObjectItem key={key} name={key} value={value}/>
            ))}

            {entries.length === 0 && (
                <div className={noEntriesMessageStyle}>Object is empty</div>
            )}
        </ul>
    )
}
