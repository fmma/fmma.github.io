var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./series", "./menu"], function (require, exports, series_1, menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.title = "bruger";
    function makeSite(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = parent._div()._form();
            form._input("Bruger", "text", series_1.sessionSeriesName())._class("big").name = "series";
            form._button("Skift bruger")._class("big");
            menu_1.makeMenu(parent)._class("big");
        });
    }
    exports.makeSite = makeSite;
});
