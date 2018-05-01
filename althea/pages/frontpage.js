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
            const div = parent._div();
            const model = yield model_1.loadModel();
            drawSite(div, model, new Date(12 * 3600 * 1000) /*12 hours*/);
            setInterval(() => {
                tickFuns.sleep();
                tickFuns.feed();
                tickFuns.sleepNext();
                tickFuns.feedNext();
            }, 1000);
        });
    }
    exports.makeSite = makeSite;
    const tickFuns = {
        sleep: () => { },
        feed: () => { },
        sleepNext: () => { },
        feedNext: () => { }
    };
    let offset = 0;
    function drawSite(parent, model, reso) {
        function makeGantt() {
            function drawGanttPlot(svg) {
                const leftBorder = 50;
                const rightBorder = 0;
                const topBorder = 0;
                const botBorder = 50;
                const width = window.innerWidth - leftBorder - rightBorder;
                const height = width / 5 + topBorder + botBorder;
                const today = new Date().getTime();
                const minT = offset + today - reso.getTime(); // Math.min(Math.min(... model.sleep.map(p => p.t0)), Math.min(... model.feed.map(p => p.t0))) - 10000;
                const maxT = offset + today;
                canvas.attr('width', width);
                canvas.attr('height', height);
                plot.attr("transform", "translate(" + leftBorder + ", " + topBorder + ")");
                const timeScale = d3.scaleTime()
                    .domain([minT, maxT])
                    .range([0, width - leftBorder - rightBorder]);
                xaxis.attr("class", "xaxis")
                    .attr("transform", "translate(" + leftBorder + ", " + (height - botBorder) + ")")
                    .call(d3.axisBottom(timeScale)
                    .tickPadding(10));
                const qq = canvas.selectAll(".xaxis text");
                qq.attr("transform", function (d) {
                    return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height + ")rotate(-45)";
                });
                grid.attr("class", "grid")
                    .attr("transform", "translate(" + leftBorder + ", " + (height - topBorder - botBorder) + ")")
                    .attr("opacity", "0.1")
                    .call(d3.axisBottom(timeScale)
                    .tickSize(-(height - topBorder - botBorder)));
                const barHeight = (height - botBorder) / 4;
                /*
                const cdiv = div._div();
                cdiv.style.position = "absolute"
                const ctxt = cdiv._text("");
                canvas.on("mousemove touchmove", () => {
                    const p = d3.mouse(svg);
                    cdiv.style.left = p[0] + "";
                    cdiv.style.top = p[1] + "";
                    ctxt.textContent = formatTime(new Date(timeScale.invert(p[0] - leftBorder)), false);
                });
                */
                feeds
                    .style("fill", "steelblue")
                    .attr("x", p => leftBorder + timeScale(p.t0))
                    .attr("width", p => 1 + timeScale(p.t1 || new Date().getTime()) - timeScale(p.t0))
                    .attr("y", d => topBorder + barHeight)
                    .attr("height", d => barHeight);
                sleeps
                    .style("fill", "red")
                    .attr("x", p => leftBorder + timeScale(p.t0))
                    .attr("width", p => 1 + timeScale((p.t1 || new Date().getTime())) - timeScale(p.t0))
                    .attr("y", d => topBorder + 3 * barHeight)
                    .attr("height", d => barHeight);
            }
            const div = parent._div();
            div.style.position = "relative";
            const svg = div._svg();
            let init = 0;
            let zooming = false;
            let oldoffset = offset;
            let oldscale = reso.getTime();
            svg.addEventListener("touchstart", (e) => {
                const te = e;
                te.preventDefault();
                if (te.touches.length === 1) {
                    zooming = false;
                    init = te.targetTouches[0].clientX;
                }
                else {
                    init = Math.abs(te.touches[0].clientX - te.touches[1].clientX);
                    zooming = true;
                }
            });
            svg.addEventListener('touchmove', (e) => {
                const te = e;
                te.preventDefault();
                if (te.touches.length === 1 && !zooming) {
                    const p = te.targetTouches[0];
                    var difx = init - p.clientX;
                    offset = oldoffset + difx * (oldscale / 500);
                }
                else if (te.touches.length === 2 && zooming) {
                    const difx = (init - Math.abs(te.touches[0].clientX - te.touches[1].clientX));
                    offset = oldoffset + difx * (oldscale / 400);
                    reso.setTime(oldscale + difx * (oldscale / 200));
                }
                window.requestAnimationFrame(() => {
                    drawGanttPlot(svg);
                });
            });
            svg.addEventListener("touchend", () => {
                oldoffset = offset;
                oldscale = reso.getTime();
            });
            const canvas = d3.select(svg);
            canvas.html("");
            const plot = canvas.append("g");
            const xaxis = canvas.append("g");
            const grid = canvas.append("g");
            const feeds = canvas.selectAll("foo").data(model.feed).enter().append("rect");
            const sleeps = canvas.selectAll("bar").data(model.sleep).enter().append("rect");
            drawGanttPlot(svg);
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
            const nextTime = key === "sleep" ? 1.5 : 2.5;
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
                    // drawSite(parent, model, reso);
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
            if (series.length > 0 && !open) {
                const t = series[series.length - 1].t1;
                if (t) {
                    const cont = timeContainer(div, false, width4);
                    const d = new Date(t + nextTime * 3600 * 1000);
                    const ttt = cont._text(dom_1.formatTime(d, false));
                    cont.style.background = (key === "sleep") === (new Date().getTime() > d.getTime()) ? "pink" : "lightgreen";
                    tickFuns[key + "Next"] = () => {
                        cont.style.background = (key === "sleep") === (new Date().getTime() > d.getTime()) ? "pink" : "lightgreen";
                    };
                }
                else {
                    const cont = timeContainer(div, false, width4);
                    cont.hidden = true;
                    cont._text("");
                    tickFuns[key + "Next"] = () => { };
                }
            }
            else {
                const cont = timeContainer(div, false, width4);
                cont.hidden = true;
                cont._text("");
                tickFuns[key + "Next"] = () => { };
            }
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
