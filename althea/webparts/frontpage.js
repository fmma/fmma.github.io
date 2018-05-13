var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../model", "../dom", "../webpart", "./gantt"], function (require, exports, model_1, dom_1, webpart_1, gantt_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class FrontPage extends webpart_1.Webpart {
        constructor(model) {
            super(model);
            this.nextTimeSleep = 1.5;
            this.nextTimeFeed = 2.75;
            this.anim = () => { };
            this.twerp = 0.0;
            const f = () => {
                this.anim();
                animFix();
            };
            const animFix = () => {
                window.requestAnimationFrame(f);
            };
            animFix();
            this.ganttPlot = new gantt_1.GanttPlot(model);
            this.ganttPlot.div = this.div;
        }
        takeDown() {
            const _super = name => super[name];
            return __awaiter(this, void 0, void 0, function* () {
                this.ganttPlot.takeDown();
                _super("takeDown").call(this);
            });
        }
        makeSite() {
            return __awaiter(this, void 0, void 0, function* () {
                this.makeControl("sleep");
                this.div._hr();
                this.makeControl("feed");
                this.makeGantt();
                this.div._link("Statistik", "#pages/stats");
                this.div._text(" - ");
                this.div._link("Manu ret", "#pages/manu");
                this.makeAltheaAnim();
            });
        }
        makeGantt() {
            this.ganttPlot.makeSite();
        }
        timeContainer(div, open, width4) {
            const timeContainer = div._span();
            timeContainer.style.fontWeight = open ? "bold" : "normal";
            timeContainer.style.width = width4;
            timeContainer.style.textAlign = "center";
            timeContainer.style.display = "inline-block";
            return timeContainer;
        }
        makeControl(key) {
            const width4 = "50%";
            const displayName = key === "sleep" ? "Søvn" : "Amning";
            const nextTime = key === "sleep" ? this.nextTimeSleep : this.nextTimeFeed;
            const series = this.model[key];
            const open = series.length > 0 && series[series.length - 1].t1 == null;
            const div = this.div._div();
            const div2 = this.div._div();
            const tc = this.timeContainer(div, false, width4);
            tc.style.textAlign = "left";
            tc.style.verticalAlign = "top";
            tc.style.fontVariant = "small-caps";
            tc._text(displayName);
            if (open) {
                const button = div._button("Slut", () => __awaiter(this, void 0, void 0, function* () {
                    series[series.length - 1].t1 = new Date().getTime();
                    button.disabled = true;
                    yield model_1.saveModel(this.model);
                    button.disabled = false;
                    yield this.drawSite();
                }));
                button.style.width = width4;
                const time = this.timeContainer(div2, true, width4)._text(dom_1.formatTime(new Date(new Date().getTime() - series[series.length - 1].t0), true));
                this.tick[key] = () => {
                    time.textContent = dom_1.formatTime(new Date(new Date().getTime() - series[series.length - 1].t0), true);
                    // drawSite(parent, model, reso);
                };
            }
            else {
                const button = div._button("Start", () => __awaiter(this, void 0, void 0, function* () {
                    this.model[key].push({ t0: new Date().getTime() });
                    button.disabled = true;
                    yield model_1.saveModel(this.model);
                    button.disabled = false;
                    this.drawSite();
                }));
                button.style.width = width4;
                if (series.length > 0) {
                    const t = series[series.length - 1].t1;
                    if (t == null)
                        throw "";
                    const time = this.timeContainer(div2, false, width4)._text(dom_1.formatTime(new Date(new Date().getTime() - t), true));
                    this.tick[key] = () => {
                        time.textContent = dom_1.formatTime(new Date(new Date().getTime() - t), true);
                    };
                }
                else {
                    const time = this.timeContainer(div2, false, width4)._text("");
                    this.tick[key] = () => { };
                }
            }
            const regret = div2._button("Fortryd", () => __awaiter(this, void 0, void 0, function* () {
                series.pop();
                regret.disabled = true;
                yield model_1.saveModel(this.model);
                regret.disabled = false;
                this.drawSite();
            }));
            regret.hidden = !open;
            regret.style.width = width4;
            if (series.length > 0 && !open) {
                const t = series[series.length - 1].t1;
                if (t) {
                    const cont = this.timeContainer(div2, false, width4);
                    const d = new Date(t + nextTime * 3600 * 1000);
                    const ttt = cont._text(dom_1.formatTime(d, false));
                    cont.style.background = (key === "sleep") === (new Date().getTime() > d.getTime()) ? "pink" : "lightgreen";
                    this.tick[key + "Next"] = () => {
                        cont.style.background = (key === "sleep") === (new Date().getTime() > d.getTime()) ? "pink" : "lightgreen";
                    };
                }
                else {
                    const cont = this.timeContainer(div2, false, width4);
                    cont.hidden = true;
                    cont._text("");
                    this.tick[key + "Next"] = () => { };
                }
            }
            else {
                const cont = this.timeContainer(div2, false, width4);
                cont.hidden = true;
                cont._text("");
                this.tick[key + "Next"] = () => { };
            }
            if (key == "feed") {
                this.timeContainer(this.div, true, width4);
                const hv = this.timeContainer(this.div, false, width4);
                const disabled = !(this.model.feed.length > 0 && this.model.feed[this.model.feed.length - 1].t1 == null);
                hv._text("V");
                hv._checkbox(series[series.length - 1] && series[series.length - 1].v || false, b => {
                    series[series.length - 1].v = b;
                }).disabled = disabled;
                hv._text("H");
                hv._checkbox(series[series.length - 1] && series[series.length - 1].h || false, b => {
                    series[series.length - 1].h = b;
                }).disabled = disabled;
            }
        }
        makeAltheaAnim() {
            const img = this.div._div()._img("resources/apple-icon-180x180.png");
            this.anim = () => {
                this.twerp += 0.01;
                img.style.marginLeft = ((window.innerWidth - 200) * (0.5 + Math.cos(this.twerp) / 2)) + "px";
            };
        }
    }
    exports.default = FrontPage;
});
