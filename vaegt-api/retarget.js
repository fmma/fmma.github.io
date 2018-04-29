var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./series", "./menu", "./plot"], function (require, exports, series_1, menu_1, plot) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeSite(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const series = yield series_1.loadSeries(series_1.sessionSeriesName());
            let startTyped = series.length > 0;
            let slutTyped = false;
            let gramPerDagTyped = false;
            let antalDageTyped = false;
            function computeOthers(noop, antalDageChanged) {
                // console.log("COMPUTING", noop, antalDageChanged, startTyped, slutTyped, gramPerDagTyped, antalDageTyped);
                if (!noop)
                    return;
                const st = start.valueAsNumber;
                const sl = slut.valueAsNumber;
                const gpd = gramPerDag.valueAsNumber;
                const n = antalDage.valueAsNumber;
                if (!antalDageChanged && startTyped && slutTyped && gramPerDagTyped) {
                    const n = Math.max(0, (st - sl) / gpd * 1000.0);
                    // console.log("N", n);
                    antalDage.value = n.toFixed(0);
                }
                else if (antalDageChanged && startTyped && slutTyped && antalDageTyped) {
                    const gpd = Math.max(0, (st - sl) / n * 1000.0);
                    gramPerDag.value = gpd.toFixed(0);
                }
                else if (startTyped && gramPerDagTyped && antalDageTyped) {
                    const sl = Math.max(0, st - gpd * n / 1000.0);
                    slut.value = sl.toFixed(1);
                }
                let date = new Date();
                const t = date.getTime();
                newTarget = target.filter(p => p.t.getTime() < t);
                newTarget.push({
                    t: date,
                    w: +start.value
                });
                date = new Date(t);
                date.setDate(date.getDate() + (+antalDage.value));
                newTarget.push({
                    t: date,
                    w: +slut.value
                });
                plot.redrawFit([series, newTarget], svg);
            }
            const start = parent._inputWeight("Start vægt", series.length > 0 ? series[series.length - 1].w : NaN)._class("big");
            start.oninput = () => {
                startTyped = start.valueAsNumber > 0;
                computeOthers(startTyped, false);
            };
            const slut = parent._inputWeight("Slut vægt", NaN)._class("big");
            slut.oninput = () => {
                slutTyped = slut.valueAsNumber > 0;
                computeOthers(slutTyped, false);
            };
            const gramPerDag = parent._inputNumber("Gram/dag", NaN)._class("big");
            gramPerDag.oninput = () => {
                gramPerDagTyped = gramPerDag.valueAsNumber > 0;
                computeOthers(gramPerDagTyped, false);
            };
            gramPerDag.min = "0";
            const antalDage = parent._inputNumber("Antal dage", NaN)._class("big");
            antalDage.oninput = () => {
                antalDageTyped = antalDage.valueAsNumber > 0;
                computeOthers(antalDageTyped, true);
            };
            antalDage.min = "0";
            const targetName = series_1.sessionSeriesName() + "_target";
            const target = yield series_1.loadSeries(targetName);
            let newTarget = target;
            parent._button("Retarget", function () {
                series_1.saveSeries(newTarget, targetName);
            })._class("big");
            menu_1.makeMenu(parent)._class("big");
            const plotSize = 500;
            const svg = plot.makePlot([series, newTarget], parent._div());
        });
    }
    exports.makeSite = makeSite;
});
