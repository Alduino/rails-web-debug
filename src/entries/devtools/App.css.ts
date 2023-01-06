import {style} from "@vanilla-extract/css";
import {vars} from "./theme.css";

export const appStyle = style({
    background: vars.colors.panelBackground,
    height: "100vh",
    display: "flex"
});

export const nodesContainerStyle = style({
    flexGrow: 1,
    height: "100vh",
    overflowY: "auto"
});
