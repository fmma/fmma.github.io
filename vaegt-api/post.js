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
            const data = yield series_1.loadSeriesWithTarget(series_1.sessionSeriesName());
            const target = data.target;
            const targetInput = parent._input("Diff", "text", "")._class("big");
            targetInput.readOnly = true;
            targetInput.style.width = "40%";
            const targetInput2 = parent._input("Target", "text", "")._class("big");
            targetInput2.readOnly = true;
            targetInput2.style.width = "40%";
            const weightInput = parent._inputWeight("Vægt", data.series.length > 0 ? data.series[data.series.length - 1].w : NaN, () => { }, () => targetTick(targetState))._class("big");
            const okButton = parent._button("Ok", () => {
                okButton.disabled = true;
                okButton.textContent = "Registreret";
                series_1.appendSeries(weightInput.value, series_1.sessionSeriesName()).then(() => {
                    window.setTimeout(() => {
                        okButton.textContent = "Ok";
                        okButton.disabled = false;
                    }, 5000);
                });
            })._class("big");
            menu_1.makeMenu(parent)._class("big");
            const targetState = {
                weightInput: weightInput,
                targetInput: targetInput,
                targetInput2: targetInput2,
                series: target,
                p0: target[0],
                p1: target[1],
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
        let diff = w - (+winput.value);
        const neg = diff <= 0;
        diff = Math.abs(diff);
        let kg = Math.floor(diff);
        let grams = Math.round(1000 * (diff - kg));
        input.value = (!neg ? "Over: " : "Under: ") + (kg === 0 ? "" : (kg + "kg ")) + (grams === 0 ? "" : (grams + "g"));
        input.style.color = "white";
        input.style.backgroundColor = neg ? "red" : "green";
        kg = Math.floor(w);
        grams = Math.round(1000 * (w - kg));
        st.targetInput2.value = "Target: " + w.toFixed(1);
    }
    function targetRepeat(targetState) {
        targetTick(targetState);
        window.setTimeout(() => targetRepeat(targetState), 1000);
    }
});
