var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../model", "../dom"], function (require, exports, model_1, dom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeSite(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = yield model_1.loadModel();
            drawSite(parent, model);
            setInterval(() => {
                tickFuns.sleep();
                tickFuns.feed();
            }, 1000);
        });
    }
    exports.makeSite = makeSite;
    const tickFuns = {
        sleep: () => { },
        fed: () => { }
    };
    function drawSite(parent, model) {
        function makeControl(key) {
            const displayName = key === "sleep" ? "søvn" : "amning";
            const series = model[key];
            const open = series.length > 0 && series[series.length - 1].t1 == null;
            const div = parent._div();
            if (open) {
                div._button("Slut " + displayName, () => {
                    series[series.length - 1].t1 = new Date().getTime();
                    model_1.saveModel(model);
                    drawSite(parent, model);
                });
                const time = div._inputTime(new Date(new Date().getTime() - series[series.length - 1].t0), () => { }, true);
                tickFuns[key] = () => {
                    time.value = dom_1.formatTime(new Date(new Date().getTime() - series[series.length - 1].t0), true);
                };
                time.disabled = true;
                time.hidden = false;
            }
            else {
                div._button("Start " + displayName, () => {
                    model[key].push({ t0: new Date().getTime() });
                    model_1.saveModel(model);
                    drawSite(parent, model);
                });
                if (series.length > 0) {
                    const t = series[series.length - 1].t1;
                    if (t == null)
                        throw "";
                    const time = div._inputTime(new Date(new Date().getTime() - t), () => { }, true);
                    tickFuns[key] = () => {
                        time.value = dom_1.formatTime(new Date(new Date().getTime() - t), true);
                    };
                    time.disabled = true;
                    time.hidden = false;
                }
                else {
                    div._inputTime(new Date(), () => { }, true).hidden = true;
                    tickFuns[key] = () => { };
                }
            }
        }
        parent._draw(() => {
            makeControl("sleep");
            makeControl("feed");
        });
    }
});
