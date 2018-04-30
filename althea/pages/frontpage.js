var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../model", "../dom", "d3"], function (require, exports, model_1, dom_1, d3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeSite(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = yield model_1.loadModel();
            drawSite(parent, model, new Date(12 * 3600 * 1000) /*12 hours*/);
            setInterval(() => {
                tickFuns.sleep();
                tickFuns.feed();
            }, 1000);
        });
    }
    exports.makeSite = makeSite;
    const tickFuns = {
        sleep: () => { },
        feed: () => { }
    };
    function drawSite(parent, model, reso) {
        function makeGantt() {
            const svg = parent._svg();
            const canvas = d3.select(svg);
            const leftBorder = 50;
            const rightBorder = 0;
            const topBorder = 0;
            const botBorder = 50;
            const width = window.innerWidth - leftBorder - rightBorder;
            const height = width / 5 + topBorder + botBorder;
            const today = new Date().getTime();
            const minT = today - reso.getTime(); // Math.min(Math.min(... model.sleep.map(p => p.t0)), Math.min(... model.feed.map(p => p.t0))) - 10000;
            const maxT = today;
            canvas.attr('width', width);
            canvas.attr('height', height);
            const plot = canvas.append("g")
                .attr("transform", "translate(" + leftBorder + ", " + topBorder + ")");
            const timeScale = d3.scaleTime()
                .domain([minT, maxT])
                .range([0, width - leftBorder - rightBorder]);
            canvas.html("");
            canvas.append("g")
                .attr("class", "xaxis")
                .attr("transform", "translate(" + leftBorder + ", " + (height - botBorder) + ")")
                .call(d3.axisBottom(timeScale)
                .tickPadding(10));
            const qq = canvas.selectAll(".xaxis text");
            qq.attr("transform", function (d) {
                return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height + ")rotate(-45)";
            });
            canvas.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(" + leftBorder + ", " + (height - topBorder - botBorder) + ")")
                .attr("opacity", "0.1")
                .call(d3.axisBottom(timeScale)
                .tickSize(-(height - topBorder - botBorder)));
            const barHeight = (height - botBorder) / 4;
            canvas.selectAll("foo").data(model.feed).enter().append("rect")
                .style("fill", "steelblue")
                .attr("x", p => {
                return timeScale(p.t0);
            })
                .attr("width", p => 1 + timeScale(p.t1 || new Date().getTime()) - timeScale(p.t0))
                .attr("y", d => topBorder + barHeight)
                .attr("height", d => barHeight);
            canvas.selectAll("bar").data(model.sleep).enter().append("rect")
                .style("fill", "red")
                .attr("x", p => timeScale(p.t0))
                .attr("width", p => 1 + timeScale((p.t1 || new Date().getTime())) - timeScale(p.t0))
                .attr("y", d => topBorder + 3 * barHeight)
                .attr("height", d => barHeight);
            const inputReso = parent._inputTime(reso, () => {
                // drawSite(parent, model, reso);
            }, true);
            inputReso.style.width = "25%";
            inputReso.min = "1";
        }
        function timeContainer(div, open, width4) {
            const timeContainer = div._span();
            timeContainer.style.fontWeight = open ? "bold" : "normal";
            timeContainer.style.width = width4;
            timeContainer.style.textAlign = "center";
            timeContainer.style.display = "inline-block";
            return timeContainer;
        }
        function makeControl(key) {
            const width4 = "25%";
            const displayName = key === "sleep" ? "Søvn" : "Amning";
            const series = model[key];
            const open = series.length > 0 && series[series.length - 1].t1 == null;
            const div = parent._div();
            timeContainer(div, false, width4)._text(displayName + ": ");
            if (open) {
                const button = div._button("Slut", () => {
                    series[series.length - 1].t1 = new Date().getTime();
                    model_1.saveModel(model);
                    drawSite(parent, model, reso);
                });
                button.style.width = width4;
                const time = timeContainer(div, true, width4)._text(dom_1.formatTime(new Date(new Date().getTime() - series[series.length - 1].t0), true));
                tickFuns[key] = () => {
                    time.textContent = dom_1.formatTime(new Date(new Date().getTime() - series[series.length - 1].t0), true);
                    drawSite(parent, model, reso);
                };
            }
            else {
                const button = div._button("Start", () => {
                    model[key].push({ t0: new Date().getTime() });
                    model_1.saveModel(model);
                    drawSite(parent, model, reso);
                });
                button.style.width = width4;
                if (series.length > 0) {
                    const t = series[series.length - 1].t1;
                    if (t == null)
                        throw "";
                    const time = timeContainer(div, false, width4)._text(dom_1.formatTime(new Date(new Date().getTime() - t), true));
                    tickFuns[key] = () => {
                        time.textContent = dom_1.formatTime(new Date(new Date().getTime() - t), true);
                        drawSite(parent, model, reso);
                    };
                }
                else {
                    const time = timeContainer(div, false, width4)._text("");
                    tickFuns[key] = () => { };
                }
            }
            const regret = div._button("Fortryd", () => {
                series.pop();
                model_1.saveModel(model);
                drawSite(parent, model, reso);
            });
            regret.hidden = !open;
            regret.style.width = width4;
        }
        parent._draw(() => {
            makeControl("sleep");
            makeControl("feed");
            makeGantt();
            twerp += 0.1;
            parent._div()._img("resources/apple-icon-180x180.png").style.marginLeft = ((window.innerWidth - 200) * (0.5 + Math.cos(twerp) / 2)) + "px";
        });
    }
    let twerp = 0.0;
});
