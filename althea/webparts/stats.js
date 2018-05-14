var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../model", "../dom", "../webpart"], function (require, exports, model_1, dom_1, webpart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Stats extends webpart_1.Webpart {
        constructor() {
            super(...arguments);
            this.avgMode = 0;
            this.stats = [
                new Stat("Start", () => dom_1.formatDate(new Date(Math.min(this.model.feed[0].t0, this.model.sleep[0].t0)))),
                new Stat("Varighed", (w, d, today) => dom_1.formatTime(new Date(today - Math.min(this.model.feed[0].t0, this.model.sleep[0].t0)), true, false)),
                new Stat("#amninger", w => model_1.sliceWindow(this.model.feed, w, true).length, true),
                new Stat("#amninger/døgn", (w, d) => model_1.sliceWindow(this.model.feed, w, true).length / d),
                new Stat("<amning>", w => new Date(model_1.average(model_1.sliceWindow(this.model.feed, w, false)))),
                new Stat("<ml. amning>", w => new Date(model_1.average(model_1.sliceWindow(model_1.invert(this.model.feed), w, false)))),
                new Stat("#lure", w => model_1.sliceWindow(this.model.sleep, w, true).length, true),
                new Stat("#lure/døgn", (w, d) => model_1.sliceWindow(this.model.sleep, w, true).length / d),
                new Stat("søvn/døgn", (w, d) => new Date(model_1.total(model_1.sliceWindow(this.model.sleep, w, true)) / d)),
                new Stat("<lur>", w => new Date(model_1.average(model_1.sliceWindow(this.model.sleep, w, false)))),
                new Stat("<vågen>", w => new Date(model_1.average(model_1.sliceWindow(model_1.invert(this.model.sleep), w, false)))),
            ];
        }
        dom() {
            return __awaiter(this, void 0, void 0, function* () {
                const sel = this.div._select(["24 timer", "en uge", "for altid"], this.avgMode, i => {
                    this.avgMode = i;
                    this.draw();
                });
                const paragraphs = [];
                const pre = this.div._pre("");
                pre.style.fontSize = "16pt";
                let tab = 0;
                for (let i = 0; i < this.stats.length; ++i) {
                    tab = Math.max(tab, this.stats[i].description.length);
                }
                tab += 2;
                this.ticks.updateStats = () => {
                    const today = new Date().getTime();
                    const days = this.avgMode == 0 ? 1 : this.avgMode == 1 ? 7 : (today - this.model.sleep[0].t0) / (24 * 3600 * 1000);
                    const timeWindow = { t0: this.avgMode == 0 ? today - 24 * 3600 * 1000 : this.avgMode == 1 ? today - 7 * 24 * 3600 * 1000 : 0, t1: today };
                    let lines = [];
                    for (let i = 0; i < this.stats.length; ++i) {
                        lines.push(this.stats[i].render(tab, timeWindow, days, today));
                    }
                    pre.textContent = lines.join("\n");
                };
                this.ticks.updateStats();
            });
        }
    }
    exports.default = Stats;
    class Stat {
        constructor(description, f, wholeNumber = false) {
            this.description = description;
            this.f = f;
            this.wholeNumber = wholeNumber;
        }
        render(tab, timeWindow, days, today) {
            const stat = this.renderStat(timeWindow, days, today);
            return this.description + (".".repeat(tab - this.description.length + (10 - stat.length))) + stat;
        }
        renderStat(timeWindow, days, today) {
            const res = this.f(timeWindow, days, today);
            if (typeof (res) === "number") {
                return this.wholeNumber ? res.toFixed(0) : res.toFixed(2);
            }
            if (typeof (res) === "string") {
                return res;
            }
            return dom_1.formatTime(res, true);
        }
    }
});
