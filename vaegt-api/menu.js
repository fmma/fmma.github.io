define(["require", "exports", "./dom"], function (require, exports, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeMenu(parent) {
        const div = parent._div();
        div._button("Forside", () => {
            new Promise((resolve_1, reject_1) => { require(["./post"], resolve_1, reject_1); }).then(dom_1.makeSite);
        })._class("linklike");
        div._text(" - ");
        div._button("Graf", () => {
            new Promise((resolve_2, reject_2) => { require(["./plot"], resolve_2, reject_2); }).then(dom_1.makeSite);
        })._class("linklike");
        div._text(" - ");
        div._button("Retarget", () => {
            new Promise((resolve_3, reject_3) => { require(["./retarget"], resolve_3, reject_3); }).then(dom_1.makeSite);
        })._class("linklike");
        div._text(" - ");
        div._button("Skift bruger", () => {
            new Promise((resolve_4, reject_4) => { require(["./change_user"], resolve_4, reject_4); }).then(dom_1.makeSite);
        })._class("linklike");
        div._text(" - ");
        div._button("Manu ret", () => {
            new Promise((resolve_5, reject_5) => { require(["./put"], resolve_5, reject_5); }).then(dom_1.makeSite);
        })._class("linklike");
        return div;
    }
    exports.makeMenu = makeMenu;
});
