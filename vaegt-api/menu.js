define(["require", "exports", "./dom"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeMenu(parent) {
        const div = parent._div();
        // div._link("Forside", "post.html");
        div._button("Forside", () => {
            document.body.innerHTML = "";
            new Promise((resolve_1, reject_1) => { require(["./post"], resolve_1, reject_1); }).then(po => po.makeSite(document.body));
        })._class("linklike");
        div._text(" - ");
        // div._link("Graf", "plot.html");
        div._button("Graf", () => {
            document.body.innerHTML = "";
            new Promise((resolve_2, reject_2) => { require(["./plot"], resolve_2, reject_2); }).then(pl => pl.makeSite(document.body));
        })._class("linklike");
        div._text(" - ");
        // div._link("Retarget", "retarget.html");
        div._button("Retarget", () => {
            document.body.innerHTML = "";
            new Promise((resolve_3, reject_3) => { require(["./retarget"], resolve_3, reject_3); }).then(re => re.makeSite(document.body));
        })._class("linklike");
        div._text(" - ");
        // div._link("Skift bruger", "change_user.html");
        div._button("Skift bruger", () => {
            document.body.innerHTML = "";
            new Promise((resolve_4, reject_4) => { require(["./change_user"], resolve_4, reject_4); }).then(pl => pl.makeSite(document.body));
        })._class("linklike");
        div._text(" - ");
        // div._link("Manu ret", "put.html");
        div._button("Manu ret", () => {
            document.body.innerHTML = "";
            new Promise((resolve_5, reject_5) => { require(["./put"], resolve_5, reject_5); }).then(pu => pu.makeSite(document.body));
        })._class("linklike");
        return div;
    }
    exports.makeMenu = makeMenu;
});
