var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./series", "./plot", "./menu"], function (require, exports, series_1, plot, menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const plotSize = 500;
    function makeSite(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield series_1.loadSeriesWithTarget(series_1.sessionSeriesName());
            const menu = menu_1.makeMenu(parent);
            menu.className = "menu";
            menu._button("Sorter", () => table.redraw());
            menu._button("Gem", () => putForm(series, target));
            const today = new Date();
            const newWeightDate = menu._inputDate(today);
            const newWeightTime = menu._inputTime(today);
            const newWeightIsTarget = menu._checkbox(1, false);
            const newWeight = menu._inputWeight("Vægt", 80.0);
            menu._button("Ny", () => {
                if (newWeightIsTarget.checked) {
                    target.push({ t: today, w: newWeight.valueAsNumber, isTarget: true });
                    target.sort((a, b) => a.t.getTime() - b.t.getTime());
                }
                else {
                    series.push({ t: today, w: newWeight.valueAsNumber, isTarget: false });
                    series.sort((a, b) => a.t.getTime() - b.t.getTime());
                }
                plot.redrawFit(series, target, svg);
                table.redraw();
            });
            const target = data.target.map(p => (Object.assign({}, p, { isTarget: true })));
            const series = data.series.map(p => (Object.assign({}, p, { isTarget: false })));
            const rowProvider = () => {
                const datapoints = series.concat(target).sort((a, b) => a.t.getTime() - b.t.getTime());
                return { n: datapoints.length, ith: (i, row) => makeRow(svg, row, series, target, table, datapoints[i]) };
            };
            const table = parent._pagedTable(["Dato", "Tid", "Vægt", "Target?", "Handlinger"], 10, rowProvider);
            table.node._class("data");
            const svg = plot.makePlot(series, target, parent._div());
            table.redraw();
        });
    }
    exports.makeSite = makeSite;
    function makeRow(svg, row, series, target, table, p) {
        row._td()._inputDate(p.t, () => {
            if (p.isTarget)
                target.sort((a, b) => a.t.getTime() - b.t.getTime());
            else
                series.sort((a, b) => a.t.getTime() - b.t.getTime());
            plot.redrawFit(series, target, svg);
        });
        row._td()._inputTime(p.t, () => {
            if (p.isTarget)
                target.sort((a, b) => a.t.getTime() - b.t.getTime());
            else
                series.sort((a, b) => a.t.getTime() - b.t.getTime());
            plot.redrawFit(series, target, svg);
        });
        row._td()._inputWeight("Vægt", p.w, w => {
            p.w = w;
            plot.redrawFit(series, target, svg);
        });
        row._td()._checkbox(1, p.isTarget, isChecked => {
            if (isChecked) {
                series.splice(series.indexOf(p), 1);
                target.push(p);
                target.sort((a, b) => a.t.getTime() - b.t.getTime());
            }
            else {
                target.splice(target.indexOf(p), 1);
                series.push(p);
                series.sort((a, b) => a.t.getTime() - b.t.getTime());
            }
            p.isTarget = isChecked;
            plot.redrawFit(series, target, svg);
        });
        const buttons = row._td();
        buttons._button("Slet", () => {
            if (p.isTarget)
                target.splice(target.indexOf(p), 1);
            else
                series.splice(series.indexOf(p), 1);
            table.redraw();
            plot.redrawFit(series, target, svg);
        });
        buttons._button("Dupliker", () => {
            if (p.isTarget)
                target.splice(target.indexOf(p), 0, { t: new Date(p.t), w: p.w, isTarget: true });
            else
                series.splice(series.indexOf(p), 0, { t: new Date(p.t), w: p.w, isTarget: false });
            table.redraw();
            plot.redrawFit(series, target, svg);
        });
    }
    function putForm(series, target) {
        series_1.saveSeries(series, series_1.sessionSeriesName());
        series_1.saveSeries(target, series_1.sessionSeriesName() + "_target");
    }
    exports.putForm = putForm;
});
