var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../model"], function (require, exports, model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeSite(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const div = parent._div();
            div._link("Forside", "#pages/frontpage");
            const model = yield model_1.loadModel(false);
            const date = new Date();
            const rowProvider = (series, hv, tableNum) => () => ({
                ith: (i, row) => {
                    date.setTime(series[i].t0);
                    row._td()._inputDateTime(date, () => {
                        model.dirty = true;
                        series[i].t0 = date.getTime();
                    });
                    date.setTime(series[i].t1 || 0);
                    row._td()._inputDateTime(date, () => {
                        model.dirty = true;
                        series[i].t1 = date.getTime();
                    });
                    if (hv) {
                        row._td()._checkbox(series[i].h || false, b => {
                            model.dirty = true;
                            series[i].h = b;
                        });
                        row._td()._checkbox(series[i].v || false, b => {
                            model.dirty = true;
                            series[i].v = b;
                        });
                    }
                    if (tableNum > 0) {
                        row._td()._button("Slet", () => {
                            series.splice(i, 1);
                            if (tableNum == 1)
                                table1.redraw();
                            else
                                table2.redraw();
                        });
                    }
                },
                n: series.length
            });
            div._button("Gem det hele", () => {
                model_1.saveModel(model);
            });
            div._button("Sorter", () => {
                model.sleep.sort((a, b) => a.t0 - b.t0);
                model.feed.sort((a, b) => a.t0 - b.t0);
                table1.redraw();
                table2.redraw();
            });
            const createModel = { sleep: [{ t0: 0 }], feed: [{ t0: 0 }], dirty: true };
            div._paragraph("Amning").style.fontWeight = "bold";
            const createRow1 = div._table("Start", "Slut", "Højre", "Venstre")._tr();
            rowProvider(createModel.feed, true, 0)().ith(0, createRow1);
            createRow1._td()._button("Opret", () => {
                model.feed.push(createModel.feed[0]);
                model.feed.sort((a, b) => a.t0 - b.t0);
                table1.redraw();
            });
            const table1 = div._pagedTable(["Start", "Slut", "Højre", "Venstre"], 10, rowProvider(model.feed, true, 1));
            div._paragraph("Søvn").style.fontWeight = "bold";
            const createRow2 = div._table("Start", "Slut")._tr();
            rowProvider(createModel.sleep, false, 0)().ith(0, createRow2);
            createRow2._td()._button("Opret", () => {
                model.sleep.push(createModel.sleep[0]);
                model.sleep.sort((a, b) => a.t0 - b.t0);
                table2.redraw();
            });
            const table2 = div._pagedTable(["Start", "Slut"], 10, rowProvider(model.sleep, false, 1));
            table1.redraw();
            table2.redraw();
        });
    }
    exports.makeSite = makeSite;
});
