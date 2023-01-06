import {style} from "@vanilla-extract/css";
import {vars} from "../theme.css";
import size from "../utils/size";

export const containerStyle = style({
    borderBottom: `1px solid ${vars.colors.sidebarDivider}`,
    padding: `${size(2)} ${size(1)}`,
    color: vars.colors.text,
    userSelect: "none"
});

export const nameStyle = style({
    fontFamily: vars.fonts.text,
    fontSize: size(3),
    marginBottom: size(2)
});
