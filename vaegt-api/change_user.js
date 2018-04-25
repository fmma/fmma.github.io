define(["require", "exports", "./series", "./menu"], function (require, exports, series_1, menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeSite(parent) {
        const form = parent._div()._form();
        form._input("Bruger", "text", series_1.sessionSeriesName())._class("big").name = "series";
        form._button("Skift bruger")._class("big");
        menu_1.makeMenu(parent)._class("big");
    }
    exports.makeSite = makeSite;
});
