import size from "../utils/size";
import {vars} from "../theme.css";
import {recipe} from "@vanilla-extract/recipes";
import {createVar, fallbackVar, style} from "@vanilla-extract/css";
import {calc} from "@vanilla-extract/css-utils";

export const indentLevelVar = createVar("indent-level");

export const titleContainerStyle = recipe({
    base: {
        display: "flex",
        alignItems: "center",
        gap: size(2),
        padding: `0 ${size(2)}`,
        color: vars.colors.nodeNameText,
        fontFamily: vars.fonts.mono,
        fontSize: size(4),
        height: size(7),
        userSelect: "none",
        overflow: "hidden",
        paddingInlineStart: calc.multiply(indentLevelVar, size(4))
    },
    variants: {
        loaded: {
            true: {
                ":hover": {
                    background: vars.colors.nodeDisplayTitleBackgroundHovered
                }
            },
            false: {
                opacity: 0.5
            }
        },
        isActiveTree: {
            true: {
                background: vars.colors.activeTreeBackground
            }
        },
        isActiveNode: {
            true: {
                background: vars.colors.activeNodeBackground,
                color: vars.colors.text,
                position: "sticky",
                top: 0,
                bottom: 0,
                ":hover": {
                    background: vars.colors.activeNodeBackgroundHovered
                }
            }
        },
        noChildren: {
            true: {
                paddingInlineStart: calc.add(calc.multiply(indentLevelVar, size(4)), size(4.5))
            }
        }
    }
});

export const expandIconStyle = style({
    opacity: 0.8,
    fontSize: size(2.5),
    color: vars.colors.text
});

export const nodeTypeLabel = style({
    marginInlineStart: "auto",
    fontFamily: vars.fonts.text,
    color: vars.colors.text,
    fontSize: size(2.5),
    opacity: 0.3
});
