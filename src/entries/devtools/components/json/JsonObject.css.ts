import {recipe} from "@vanilla-extract/recipes";
import size from "../../utils/size";
import {style} from "@vanilla-extract/css";
import {vars} from "../../theme.css";

export const objectContainerStyle = style({
    margin: 0,
    padding: 0
});

export const noEntriesMessageStyle = style({
    marginInlineStart: size(4),
    opacity: 0.8,
    fontStyle: "italic",
    fontSize: size(3),
    fontFamily: vars.fonts.text
});

export const itemContainerStyle = recipe({
    base: {
        display: "flex",
        alignItems: "center",
        gap: size(1),
        margin: 0,
        padding: `${size(0.5)} ${size(1)}`,
        fontSize: size(3),
        listStyleType: "none"
    },
    variants: {
        hasArrow: {
            false: {
                paddingLeft: size(6.5)
            }
        }
    }
});

export const copyButtonStyle = style({
    opacity: 0.6,
    cursor: "pointer",
    display: "none",
    ":hover": {
        opacity: 0.8
    },
    selectors: {
        ".json-object-item:hover &": {
            display: "block"
        },
    }
});

export const itemChildrenContainerStyle = style({
    paddingInlineStart: size(4),
    listStyleType: "none"
});

export const keyStyle = style({
    fontFamily: vars.fonts.mono,
    color: vars.colors.text,
    ":after": {
        content: ":"
    }
});

export const valueStyle = style({
    fontFamily: vars.fonts.mono,
    color: vars.colors.text,
    opacity: 0.8,
    userSelect: "text"
});

export const expandIconStyle = style({
    opacity: 0.8,
    fontSize: size(2.5),
    padding: size(1),
    width: size(2.5),
    height: size(2.5),
    cursor: "pointer",
    ":hover": {
        borderRadius: "50%",
        background: vars.colors.smallButtonHoverBackground
    }
});
