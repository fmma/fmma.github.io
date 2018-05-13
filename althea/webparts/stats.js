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
        }
        make() {
            return __awaiter(this, void 0, void 0, function* () {
                const sel = this.div._select(["24 timer", "en uge", "for altid"], this.avgMode, i => {
                    this.avgMode = i;
                    this.draw();
                });
                const gnmAmn = this.div._paragraph("");
                const gnmMlAmn = this.div._paragraph("");
                const gnmSovn = this.div._paragraph("");
                const sleepPerDay = this.div._paragraph("");
                const gnmVaag = this.div._paragraph("");
                this.ticks.updateStats = () => {
                    const today = new Date().getTime();
                    const timeFrame = this.avgMode == 0 ? 1 : this.avgMode == 1 ? 7 : (today - this.model.sleep[0].t0) / (24 * 3600 * 1000);
                    const w = { t0: this.avgMode == 0 ? today - 24 * 3600 * 1000 : this.avgMode == 1 ? today - 7 * 24 * 3600 * 1000 : 0, t1: today };
                    gnmAmn.textContent = "Gennemsnit amning: " + dom_1.formatTime(new Date(model_1.average(model_1.sliceWindow(this.model.feed, w, false))), true);
                    gnmMlAmn.textContent = "Gennemsnit mellem amning: " + dom_1.formatTime(new Date(model_1.average(model_1.sliceWindow(model_1.invert(this.model.feed), w, false))), true);
                    gnmSovn.textContent = "Gennemsnit søvn: " + dom_1.formatTime(new Date(model_1.average(model_1.sliceWindow(this.model.sleep, w, false))), true);
                    sleepPerDay.textContent = "Søvn / døgn: " + dom_1.formatTime(new Date(model_1.total(model_1.sliceWindow(this.model.sleep, w, true)) / timeFrame), true);
                    gnmVaag.textContent = "Gennemsnit vågen: " + dom_1.formatTime(new Date(model_1.average(model_1.sliceWindow(model_1.invert(this.model.sleep), w, false))), true);
                };
                this.ticks.updateStats();
            });
        }
    }
    exports.default = Stats;
});
