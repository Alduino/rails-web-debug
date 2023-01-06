import {createTheme, globalStyle} from "@vanilla-extract/css";

export const [themeClass, vars] = createTheme({
    colors: {
        text: "#ffffff",
        textInv: "#2f2a29",
        nodeNameText: "#c26357",
        panelBackground: "#383332",
        nodeDisplayTitleBackground: "#735552",
        nodeDisplayTitleBackgroundHovered: "rgba(227,233,236,0.15)",
        panelDivider: "#d7bfbc",
        sidebarDivider: "#605353",
        smallButtonHoverBackground: "#e5e5f322",
        activeTreeBackground: "rgba(227,233,236,0.08)",
        activeNodeBackground: "#c26057",
        activeNodeBackgroundHovered: "#d0766a",
    },
    fonts: {
        text: "sans-serif",
        mono: "monospace"
    }
})
