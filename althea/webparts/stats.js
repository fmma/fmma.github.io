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
    class Stat {
        constructor(description, f) {
            this.description = description;
            this.f = f;
        }
        render(tab, w, timeFrame, today) {
            const stat = this.renderStat(w, timeFrame, today);
            return this.description + (".".repeat(tab - this.description.length + (10 - stat.length))) + stat;
        }
        renderStat(w, timeFrame, today) {
            const res = this.f(w, timeFrame, today);
            if (typeof (res) === "number") {
                return res.toFixed(2);
            }
            if (typeof (res) === "string") {
                return res;
            }
            return dom_1.formatTime(res, true);
        }
    }
    class Stats extends webpart_1.Webpart {
        constructor() {
            super(...arguments);
            this.avgMode = 0;
            this.stats = [
                new Stat("Start", () => dom_1.formatDate(new Date(Math.min(this.model.feed[0].t0, this.model.sleep[0].t0)))),
                new Stat("Varighed", (w, timeFrame, today) => dom_1.formatTime(new Date(today - Math.min(this.model.feed[0].t0, this.model.sleep[0].t0)), true, false)),
                new Stat("#amninger", w => model_1.sliceWindow(this.model.feed, w, true).length),
                new Stat("#aminger/dag", (w, timeFrame) => model_1.sliceWindow(this.model.feed, w, true).length / timeFrame),
                new Stat("<amning>", w => new Date(model_1.average(model_1.sliceWindow(this.model.feed, w, false)))),
                new Stat("<ml. amning>", w => new Date(model_1.average(model_1.sliceWindow(model_1.invert(this.model.feed), w, false)))),
                new Stat("#lure", w => model_1.sliceWindow(this.model.sleep, w, true).length),
                new Stat("#lure/døgn", (w, timeFrame) => model_1.sliceWindow(this.model.sleep, w, true).length / timeFrame),
                new Stat("søvn/døgn", (w, timeFrame) => new Date(model_1.total(model_1.sliceWindow(this.model.sleep, w, true)) / timeFrame)),
                new Stat("<lur>", w => new Date(model_1.average(model_1.sliceWindow(this.model.sleep, w, false)))),
                new Stat("<vågen>", w => new Date(model_1.average(model_1.sliceWindow(model_1.invert(this.model.sleep), w, false)))),
            ];
        }
        make() {
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
                    const timeFrame = this.avgMode == 0 ? 1 : this.avgMode == 1 ? 7 : (today - this.model.sleep[0].t0) / (24 * 3600 * 1000);
                    const w = { t0: this.avgMode == 0 ? today - 24 * 3600 * 1000 : this.avgMode == 1 ? today - 7 * 24 * 3600 * 1000 : 0, t1: today };
                    let lines = [];
                    for (let i = 0; i < this.stats.length; ++i) {
                        lines.push(this.stats[i].render(tab, w, timeFrame, today));
                    }
                    pre.textContent = lines.join("\n");
                };
                this.ticks.updateStats();
            });
        }
    }
    exports.default = Stats;
});
