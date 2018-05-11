var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../model", "../page"], function (require, exports, model_1, page_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Manu extends page_1.Page {
        makeSite() {
            return __awaiter(this, void 0, void 0, function* () {
                this.makeMenu();
                this.makeControlButtons();
                this.makeFeedTable();
                this.makeSleepTable();
            });
        }
        makeMenu() {
            this.div._div()._link("Forside", "#pages/frontpage");
        }
        makeControlButtons() {
            const buttonsDiv = this.div._div();
            buttonsDiv._button("Gem det hele", () => {
                model_1.saveModel(this.model);
            });
            buttonsDiv._button("Sorter", () => {
                this.model.sleep.sort((a, b) => a.t0 - b.t0);
                this.model.feed.sort((a, b) => a.t0 - b.t0);
                this.feedTable.redraw();
                this.sleepTable.redraw();
            });
        }
        makeFeedTable() {
            this.div._paragraph("Amning").style.fontWeight = "bold";
            const columns = ["Start", "Slut", "Højre", "Venstre"];
            this.makeCreateRow(columns, this.model.feed, this.feedTable, true);
            const rowProvider = this.createRowProvider(this.model.feed, true, 1);
            this.feedTable = this.div._pagedTable(columns, 10, rowProvider);
            this.feedTable.redraw();
        }
        makeCreateRow(columns, series, table, hv) {
            const createPeriod = { t0: 0 };
            const createRow = this.div._table(...columns)._tr();
            this.createRowProvider([createPeriod], hv, 0)().ith(0, createRow);
            createRow._td()._button("Opret", () => {
                series.push(Object.assign({}, createPeriod));
                series.sort((a, b) => a.t0 - b.t0);
                table.redraw();
            });
        }
        makeSleepTable() {
            this.div._paragraph("Søvn").style.fontWeight = "bold";
            const columns = ["Start", "Slut"];
            this.makeCreateRow(columns, this.model.sleep, this.sleepTable, false);
            const rowProvider = this.createRowProvider(this.model.sleep, false, 1);
            this.sleepTable = this.div._pagedTable(columns, 10, rowProvider);
            this.sleepTable.redraw();
        }
        createRowProvider(series, hv, tableNum) {
            const rp = new ManuRowProvider(this, series, hv, tableNum);
            return () => rp;
        }
    }
    class ManuRowProvider {
        constructor(manu, series, hv, tableNum) {
            this.date = new Date();
            this.manu = manu;
            this.series = series;
            this.hv = hv;
            this.tableNum = tableNum;
        }
        get n() {
            return this.series.length;
        }
        ith(j, row) {
            const i = this.series.length - j - 1;
            this.date.setTime(this.series[i].t0);
            row._td()._inputDateTime(this.date, () => {
                this.series[i].t0 = this.date.getTime();
            });
            this.date.setTime(this.series[i].t1 || 0);
            row._td()._inputDateTime(this.date, () => {
                this.series[i].t1 = this.date.getTime();
            });
            if (this.hv) {
                row._td()._checkbox(this.series[i].h || false, b => {
                    this.series[i].h = b;
                });
                row._td()._checkbox(this.series[i].v || false, b => {
                    this.series[i].v = b;
                });
            }
            if (this.tableNum > 0) {
                row._td()._button("Slet", () => {
                    this.series.splice(i, 1);
                    if (this.tableNum == 1)
                        this.manu.feedTable.redraw();
                    else
                        this.manu.sleepTable.redraw();
                });
            }
        }
    }
    exports.default = Manu;
});
