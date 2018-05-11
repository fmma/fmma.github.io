var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./model"], function (require, exports, model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PageContainer {
        constructor(pageName, pageModule) {
            this.pageName = pageName;
            this.pageModule = pageModule;
            this.page = null;
        }
        makeSite(parent, model) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.page == null) {
                    const module = yield this.pageModule();
                    this.page = new module.default(model);
                }
                yield this.page.drawSite();
                parent.appendChild(this.page.div);
            });
        }
    }
    class Site {
        constructor() {
            this.defaultPage = "#pages/frontpage";
            this.pages = [
                new PageContainer("#pages/frontpage", () => new Promise((resolve_1, reject_1) => { require(["./pages/frontpage"], resolve_1, reject_1); })),
                new PageContainer("#pages/stats", () => new Promise((resolve_2, reject_2) => { require(["./pages/stats"], resolve_2, reject_2); })),
                new PageContainer("#pages/manu", () => new Promise((resolve_3, reject_3) => { require(["./pages/manu"], resolve_3, reject_3); })),
            ];
            this.activePage = null;
            this.model = model_1.loadModel(true);
            this.model.then(() => this.hashChanged());
            window.onhashchange = () => this.hashChanged();
        }
        hashChanged() {
            this.switchPage(window.location.hash || this.defaultPage);
        }
        switchPage(pageName) {
            return __awaiter(this, void 0, void 0, function* () {
                const frag = document.createDocumentFragment();
                const page = this.pages.find(p => p.pageName === pageName);
                if (page) {
                    if (this.activePage) {
                        yield this.activePage.takeDown();
                    }
                    yield page.makeSite(frag, yield this.model);
                    this.activePage = page.page;
                    if (document.body) {
                        document.body.appendChild(frag);
                    }
                    else {
                        window.onload = () => {
                            document.body.appendChild(frag);
                        };
                    }
                }
                else {
                    console.error("Page not found!: ", pageName);
                }
            });
        }
    }
    exports.Site = Site;
});
