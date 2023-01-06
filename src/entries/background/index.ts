import {Runtime, runtime, tabs} from "webextension-polyfill";
import browserPackageSource from "../../build-assets/browser-package.js?raw";

console.log("Hello from background script!");

function isNumeric(str: string): boolean {
    return +str + "" === str;
}

type Ports = "devtools" | "content-script";

const ports: Record<number, Record<Ports, Runtime.Port>> = {};

const messageQueue = new Map<number, unknown[]>();

function addMessageToQueue(tabId: number, message: unknown) {
    const empty: unknown[] = [];
    const queue = messageQueue.get(tabId) ?? empty;

    queue.push(message);

    if (queue === empty) messageQueue.set(tabId, queue);
}

function readMessagesFromQueue(tabId: number) {
    const queue = messageQueue.get(tabId);
    return queue ?? [];
}

runtime.onConnect.addListener(port => {
    let tab: number, name: Ports;

    if (isNumeric(port.name)) {
        tab = parseFloat(port.name);
        name = "devtools";
        installBrowserPackage(tab);
    } else {
        tab = port.sender.tab.id;
        name = "content-script";
    }

    if (!ports[tab]) {
        ports[tab] = {
            devtools: null,
            "content-script": null
        };
    }

    console.log(name, "port connected for tab", tab);

    ports[tab][name] = port;

    if (name === "content-script") {
        const queuedMessages = readMessagesFromQueue(tab);
        for (const message of queuedMessages) port.postMessage(message);
    }

    if (ports[tab].devtools && ports[tab]["content-script"]) {
        console.log("2-way connection on tab", tab, "initiated");
        doublePipe(ports[tab].devtools, ports[tab]["content-script"]);
    }

    if (name === "devtools") {
        port.onMessage.addListener((request) => {
            const contentScript = ports[tab]["content-script"];

            if (contentScript) {
                contentScript.postMessage(request);
            } else {
                addMessageToQueue(tab, request);
            }
        });
    }
});

runtime.onMessage.addListener((request, sender) => {
    const tab = sender.tab;

    if (tab) {
        const devtools = ports[tab.id]?.devtools;
        devtools?.postMessage(request);
    }
})

function installBrowserPackage(tabId: number) {
    return tabs.executeScript(tabId, {
        code: browserPackageSource
    });
}

function doublePipe(one: Runtime.Port, two: Runtime.Port) {
    one.postMessage({type: "2way"});
    two.postMessage({type: "2way"});

    one.onMessage.addListener(lOne);

    function lOne(message: unknown) {
        two.postMessage(message);
    }

    two.onMessage.addListener(lTwo);

    function lTwo(message: unknown) {
        one.postMessage(message);
    }

    function shutdown() {
        console.log("2-way connection shut down");
        one.onMessage.removeListener(lOne);
        two.onMessage.removeListener(lTwo);
        one.disconnect();
        two.disconnect();
    }

    one.onDisconnect.addListener(shutdown);
    two.onDisconnect.addListener(shutdown);
}
