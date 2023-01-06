
var _browser;
if (chrome) {
    _browser = chrome;
} else {
    _browser = browser;
}

if (!location.search) {
    console.log("Configured as root instance");

    _browser.devtools.panels.create(
        "Rails",
        "/assets/rails-logo.png",
        "/src/entries/devtools/root.html?panel"
    );
}
