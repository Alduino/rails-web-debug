import {style} from "@vanilla-extract/css";
import {vars} from "../theme.css";
import size from "../utils/size";

export const containerStyle = style({
    width: "40vw",
    flexShrink: 0,
    borderInlineStart: `1px solid ${vars.colors.panelDivider}`
});

