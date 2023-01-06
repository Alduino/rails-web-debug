import {version} from "./package.json";
import {defineConfig} from "vite";
import webExtension from "@samrum/vite-plugin-web-extension";
import react from "@vitejs/plugin-react-swc";
import {vanillaExtractPlugin} from "@vanilla-extract/vite-plugin";

export default defineConfig({
    assetsInclude: [
        "*.html",
        "*.woff",
        "*.woff2"
    ],
    plugins: [
        react(),
        vanillaExtractPlugin(),
        webExtension({
            manifest: {
                name: "Rails Web Debug",
                description: "Show a tree view of Rails templates",
                version,
                manifest_version: 2,
                devtools_page: "src/entries/devtools/root.html",
                background: {
                    scripts: [
                        "src/entries/background/index.ts"
                    ]
                },
                permissions: [
                    "<all_urls>",
                    "clipboardRead"
                ]
            }
        })
    ]
})
