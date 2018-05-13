var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./webpart"], function (require, exports, webpart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Page extends webpart_1.Webpart {
        constructor(model, location, webparts) {
            super(model);
            this.location = location;
            this.webparts = webparts;
            this.webpartsCache = null;
        }
        getWebparts() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.webpartsCache != null)
                    return this.webpartsCache;
                const modules = yield Promise.all(this.webparts());
                const webparts = modules.map(module => {
                    const webpart = new module.default(this.model);
                    webpart.attachToPage(this);
                    return webpart;
                });
                this.webpartsCache = webparts;
                return webparts;
            });
        }
        make() {
            return __awaiter(this, void 0, void 0, function* () {
                const webparts = yield this.getWebparts();
                webparts.forEach(webpart => webpart.draw());
            });
        }
    }
    exports.Page = Page;
});
