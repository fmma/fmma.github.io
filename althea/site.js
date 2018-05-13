var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./model", "./page"], function (require, exports, model_1, page_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Site {
        constructor() {
            this.defaultPage = "#pages/frontpage";
            this.activePage = -1;
            this.model = model_1.loadModel(true);
            this.model.then(() => this.hashChanged());
            this.pages =
                this.model.then(model => [
                    new page_1.Page(model, "#pages/frontpage", () => [new Promise((resolve_1, reject_1) => { require(["./webparts/menu"], resolve_1, reject_1); }), new Promise((resolve_2, reject_2) => { require(["./webparts/sleepAndFeed"], resolve_2, reject_2); }), new Promise((resolve_3, reject_3) => { require(["./webparts/gantt"], resolve_3, reject_3); }), new Promise((resolve_4, reject_4) => { require(["./webparts/althea"], resolve_4, reject_4); })]),
                    new page_1.Page(model, "#pages/stats", () => [new Promise((resolve_5, reject_5) => { require(["./webparts/menu"], resolve_5, reject_5); }), new Promise((resolve_6, reject_6) => { require(["./webparts/stats"], resolve_6, reject_6); })]),
                    new page_1.Page(model, "#pages/manu", () => [new Promise((resolve_7, reject_7) => { require(["./webparts/menu"], resolve_7, reject_7); }), new Promise((resolve_8, reject_8) => { require(["./webparts/manu"], resolve_8, reject_8); })]),
                ]);
            window.onhashchange = () => this.hashChanged();
            // this.swipeMenu();
        }
        hashChanged() {
            this.switchPage(window.location.hash || this.defaultPage);
        }
        switchPageIndex(page) {
            return __awaiter(this, void 0, void 0, function* () {
                const frag = document.createDocumentFragment();
                const pages = yield this.pages;
                if (page < 0 || page >= pages.length) {
                    throw new Error("Bad page index");
                }
                if (this.activePage > -1) {
                    pages[this.activePage].takeDown();
                }
                pages[page].draw();
                this.activePage = page;
                if (document.body) {
                    pages[page].attachTo(document.body);
                }
                else {
                    window.onload = () => {
                        pages[page].attachTo(document.body);
                    };
                }
            });
        }
        switchPage(pageName) {
            return __awaiter(this, void 0, void 0, function* () {
                const frag = document.createDocumentFragment();
                const pages = yield this.pages;
                const page = pages.findIndex(p => p.location === pageName);
                if (page > -1) {
                    this.switchPageIndex(page);
                }
                else {
                    console.error("Page not found!: ", pageName);
                }
            });
        }
        swipeMenu() {
            document.addEventListener('touchstart', handleTouchStart, false);
            document.addEventListener('touchmove', handleTouchMove, false);
            let xDown = null;
            let yDown = null;
            const his = this;
            function handleTouchStart(event) {
                const evt = event;
                xDown = evt.touches[0].clientX;
                yDown = evt.touches[0].clientY;
            }
            ;
            function handleTouchMove(event) {
                const evt = event;
                if (!xDown || !yDown) {
                    return;
                }
                var xUp = evt.touches[0].clientX;
                var yUp = evt.touches[0].clientY;
                var xDiff = xUp - xDown;
                var yDiff = yUp - yDown;
                if (Math.abs(xDiff) > Math.abs(yDiff)) { /*most significant*/
                    if (xDiff > 50) {
                        /* left swipe */
                        his.switchPageIndex(his.activePage - 1);
                        /* reset values */
                        xDown = null;
                        yDown = null;
                    }
                    else if (xDiff < -50) {
                        /* right swipe */
                        /* reset values */
                        xDown = null;
                        yDown = null;
                    }
                }
                else {
                    if (yDiff > 0) {
                        /* up swipe */
                    }
                    else {
                        /* down swipe */
                    }
                }
            }
            ;
        }
    }
    exports.Site = Site;
});
