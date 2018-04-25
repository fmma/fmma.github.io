var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./series", "./menu"], function (require, exports, series_1, menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeSite(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const series = yield series_1.loadSeries(series_1.sessionSeriesName() + "_target");
            const targetInput = parent._inputWeight("Target", NaN)._class("big");
            targetInput.readOnly = true;
            const weightInput = parent._inputWeight("Vægt", NaN, () => targetTick(targetState))._class("big");
            const okButton = parent._button("Ok", () => {
                okButton.disabled = true;
                series_1.appendSeries(weightInput.value, series_1.sessionSeriesName()).then(() => {
                    weightInput.value = "";
                    okButton.disabled = false;
                });
            })._class("big");
            menu_1.makeMenu(parent)._class("big");
            const targetState = {
                weightInput: weightInput,
                targetInput: targetInput,
                series: series,
                p0: series[0],
                p1: series[1],
                i: 2
            };
            targetRepeat(targetState);
        });
    }
    exports.makeSite = makeSite;
    ;
    function targetTick(st) {
        const t = new Date().getTime();
        let p0 = st.p0;
        let p1 = st.p1;
        const series = st.series;
        if (series.length < 2 || p0.t.getTime() > t) {
            return;
        }
        let i = st.i;
        for (; i < series.length; ++i) {
            if (t < p1.t.getTime()) {
                break;
            }
            else {
                p0 = p1;
                p1 = series[i];
            }
        }
        st.p0 = p0;
        st.p1 = p1;
        st.i = i;
        const t0 = p0.t.getTime();
        const t1 = p1.t.getTime();
        const w = (t1 - t) * p0.w / (t1 - t0) + (t - t0) * p1.w / (t1 - t0);
        const input = st.targetInput;
        const winput = st.weightInput;
        const diff = w - +winput.value;
        input.value = diff.toFixed(7);
        input.style.color = "white";
        input.style.backgroundColor = diff < 0 ? "red" : "green";
    }
    function targetRepeat(targetState) {
        targetTick(targetState);
        window.setTimeout(() => targetRepeat(targetState), 1000);
    }
});
