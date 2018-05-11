var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Page {
        constructor(model) {
            this.model = model;
            this.tick = {};
            if (parent == null)
                throw new Error("Null div");
            if (model == null)
                throw new Error("Null model");
            this.div = document.createElement("div");
            this.interval = setInterval(() => {
                if (!document.hidden) {
                    for (let fun in this.tick) {
                        this.tick[fun]();
                    }
                }
            }, 1000);
        }
        takeDown() {
            return __awaiter(this, void 0, void 0, function* () {
                clearInterval(this.interval);
                if (this.div.parentElement)
                    this.div.parentElement.removeChild(this.div);
            });
        }
        drawSite() {
            return __awaiter(this, void 0, void 0, function* () {
                this.div._draw(() => __awaiter(this, void 0, void 0, function* () { return yield this.makeSite(); }));
            });
        }
    }
    exports.Page = Page;
});
