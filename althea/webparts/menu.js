var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../webpart"], function (require, exports, webpart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Menu extends webpart_1.Webpart {
        dom() {
            return __awaiter(this, void 0, void 0, function* () {
                this.link("Forside", "#pages/frontpage");
                this.div._text("--");
                this.link("Statistik", "#pages/stats");
                this.div._text("--");
                this.link("Manu", "#pages/manu");
            });
        }
        link(name, location) {
            const link = this.div._link(name, location);
            if (window.location.hash === location) {
                link.style.border = "1px solid black";
                link.style.borderRadius = "5px";
            }
        }
    }
    exports.default = Menu;
});
