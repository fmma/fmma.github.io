define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Webpart {
        constructor(model) {
            this.model = model;
            this.page = null;
            this.interval = null;
            this.ticks = {};
            if (parent == null)
                throw new Error("Null div");
            if (model == null)
                throw new Error("Null model");
            this.div = document.createElement("div");
        }
        startTicking() {
            this.interval = setInterval(() => {
                if (!document.hidden) {
                    for (let fun in this.ticks) {
                        this.ticks[fun]();
                    }
                }
            }, 1000);
        }
        takeDown() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            if (this.div.parentElement)
                this.div.parentElement.removeChild(this.div);
        }
        draw() {
            this.div._draw(() => this.make());
        }
        drawPage() {
            if (this.page) {
                this.page.draw();
            }
        }
        attachTo(node) {
            node.appendChild(this.div);
        }
        attachToPage(page) {
            this.page = page;
            this.attachTo(page.div);
        }
    }
    exports.Webpart = Webpart;
});
