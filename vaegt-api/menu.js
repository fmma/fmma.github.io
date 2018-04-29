define(["require", "exports", "./dom"], function (require, exports, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window.onhashchange = () => {
        const x = window.location.hash.substr(1);
        new Promise((resolve_1, reject_1) => { require(["./" + x], resolve_1, reject_1); }).then(dom_1.makeSite);
    };
    function makeMenu(parent) {
        const div = parent._div();
        div._button("Forside", () => {
            window.location.href = "#post";
        })._class("linklike");
        div._text(" - ");
        div._button("Graf", () => {
            window.location.href = "#plot";
        })._class("linklike");
        div._text(" - ");
        div._button("Retarget", () => {
            window.location.href = "#retarget";
        })._class("linklike");
        div._text(" - ");
        div._button("Skift bruger", () => {
            window.location.href = "#change_user";
        })._class("linklike");
        div._text(" - ");
        div._button("Manu ret", () => {
            window.location.href = "#put";
        })._class("linklike");
        return div;
    }
    exports.makeMenu = makeMenu;
});
