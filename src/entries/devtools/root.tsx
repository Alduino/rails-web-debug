import {createRoot} from "react-dom/client";
import {App} from "./App";
import {devtools, runtime} from "webextension-polyfill";
import {MessagingPortProvider} from "./hooks/useMessagingPort";
import React from "react";
import {ActiveNodeProvider} from "./hooks/active-node";
import {RootNodeLoader} from "./node-tree";
import {NodeTreeProvider} from "./hooks/node-tree";
import {WebMessage} from "../shared/WebMessage";

(async () => {
    if (location.search === "?panel") {
        console.log("Configured as panel instance");

        const rootElement = document.getElementById("app");
        const root = createRoot(rootElement);

        console.log("Connecting to runtime messaging system");
        const port = runtime.connect({
            name: devtools.inspectedWindow.tabId.toString()
        });

        let triggerBrowserPackageInitialised: () => void = () => { /* noop */ };

        const browserPackageInitialised = new Promise<void>(yay => {
            triggerBrowserPackageInitialised = yay;
        });

        console.log("Listening for updates");
        port.onMessage.addListener((message: WebMessage) => {
            if (message.type === "unload") {
                location.reload();
            } else if (message.type === "init") {
                triggerBrowserPackageInitialised();
            }
        });

        console.log("Waiting for init");
        await browserPackageInitialised;

        console.log("Setting up React");
        const nodeTreeRoot = new RootNodeLoader(port);

        root.render(
            <MessagingPortProvider value={port}>
                <NodeTreeProvider value={nodeTreeRoot}>
                    <ActiveNodeProvider>
                        <App/>
                    </ActiveNodeProvider>
                </NodeTreeProvider>
            </MessagingPortProvider>
        );
    }
})().catch(err => console.error(err));
