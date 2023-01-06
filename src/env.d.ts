/// <reference types="@samrum/vite-plugin-web-extension/client" />
/// <reference types="vite/client" />

declare module "*.html" {
    const src: string;
    export default src;
}
