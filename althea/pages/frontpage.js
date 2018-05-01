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
            drawSite(div, model, new Date(12 * 3600 * 1000) /*12 hours*/, 0);
            setInterval(() => {
                tickFuns.sleep();
                tickFuns.feed();
                tickFuns.sleepNext();
                tickFuns.feedNext();
            }, 1000);
            const animFix = () => window.requestAnimationFrame(() => {
                tickFuns.anim();
                animFix();
            });
            animFix();
        });
    }
    exports.makeSite = makeSite;
    const tickFuns = {
        sleep: () => { },
        feed: () => { },
        sleepNext: () => { },
        feedNext: () => { },
        anim: () => { }
    };
    let offset = 0;
    function drawSite(parent, model, reso, avgMode) {
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
                /*
                feeds
                    .style("fill", "steelblue")
                    .attr("x", p => leftBorder + timeScale(p.t0))
                    .attr("width", p => 1 + timeScale(p.t1 || new Date().getTime()) - timeScale(p.t0))
                    .attr("y", d => topBorder + barHeight)
                    .attr("height", d => barHeight);
                */
                const line = d3.line();
                feedsHV
                    .attr("d", p => line(p.h && p.v
                    ? [[leftBorder + timeScale(p.t0) + 1, topBorder + barHeight],
                        [leftBorder + timeScale(p.t0) + 1 - barHeight / 5, topBorder + 1.5 * barHeight],
                        [leftBorder + timeScale(p.t0) + 1, topBorder + 2 * barHeight],
                        [leftBorder + timeScale(p.t1 || new Date().getTime()), topBorder + 2 * barHeight],
                        [leftBorder + timeScale(p.t1 || new Date().getTime()) + barHeight / 5, topBorder + 1.5 * barHeight],
                        [leftBorder + timeScale(p.t1 || new Date().getTime()), topBorder + barHeight]
                    ]
                    : p.v
                        ? [[leftBorder + timeScale(p.t0) + 1, topBorder + barHeight],
                            [leftBorder + timeScale(p.t0) + 1 - barHeight / 5, topBorder + 1.5 * barHeight],
                            [leftBorder + timeScale(p.t0) + 1, topBorder + 2 * barHeight],
                            [leftBorder + timeScale(p.t1 || new Date().getTime()), topBorder + 2 * barHeight],
                            [leftBorder + timeScale(p.t1 || new Date().getTime()), topBorder + 1.5 * barHeight],
                            [leftBorder + timeScale(p.t1 || new Date().getTime()), topBorder + barHeight]
                        ]
                        : p.h
                            ? [[leftBorder + timeScale(p.t0) + 1, topBorder + barHeight],
                                [leftBorder + timeScale(p.t0) + 1, topBorder + 1.5 * barHeight],
                                [leftBorder + timeScale(p.t0) + 1, topBorder + 2 * barHeight],
                                [leftBorder + timeScale(p.t1 || new Date().getTime()), topBorder + 2 * barHeight],
                                [leftBorder + timeScale(p.t1 || new Date().getTime()) + barHeight / 5, topBorder + 1.5 * barHeight],
                                [leftBorder + timeScale(p.t1 || new Date().getTime()), topBorder + barHeight]
                            ]
                            : [[leftBorder + timeScale(p.t0) + 1, topBorder + barHeight],
                                [leftBorder + timeScale(p.t0) + 1, topBorder + 1.5 * barHeight],
                                [leftBorder + timeScale(p.t0) + 1, topBorder + 2 * barHeight],
                                [leftBorder + timeScale(p.t1 || new Date().getTime()), topBorder + 2 * barHeight],
                                [leftBorder + timeScale(p.t1 || new Date().getTime()), topBorder + 1.5 * barHeight],
                                [leftBorder + timeScale(p.t1 || new Date().getTime()), topBorder + barHeight]
                            ]))
                    .attr("stroke", "steelblue")
                    .attr("fill", "steelblue");
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
            const feedsHV = canvas.selectAll("foobar").data(model.feed).enter().append("path");
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
                    if (key === "feed") {
                        series[series.length - 1].h = bh;
                        series[series.length - 1].v = bv;
                        console.log(series[series.length - 1]);
                    }
                    model_1.saveModel(model);
                    drawSite(parent, model, reso, avgMode);
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
                    drawSite(parent, model, reso, avgMode);
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
                drawSite(parent, model, reso, avgMode);
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
            let bh = false;
            let bv = false;
            if (key == "feed") {
                if (series.length > 0) {
                    bh = series[series.length - 1].h || false;
                    bv = series[series.length - 1].v || false;
                }
                timeContainer(parent, true, "25%");
                const hv = timeContainer(parent, false, "25%");
                const disabled = !(model.feed.length > 0 && model.feed[model.feed.length - 1].t1 == null);
                hv._text("V");
                hv._checkbox(bv, b => { bv = b; }).disabled = disabled;
                hv._text("H");
                hv._checkbox(bh, b => { bh = b; }).disabled = disabled;
            }
        }
        parent._draw(() => {
            makeControl("sleep");
            makeControl("feed");
            makeGantt();
            const sel = parent._select(["24 timer", "en uge", "for altid"], avgMode, i => {
                drawSite(parent, model, reso, i);
            });
            const today = new Date().getTime();
            const w = { t0: avgMode == 0 ? today - 24 * 3600 * 1000 : avgMode == 1 ? today - 7 * 24 * 3600 * 1000 : 0, t1: today };
            parent._paragraph("Gennemsnit amning: " + dom_1.formatTime(new Date(model_1.average(model_1.sliceWindow(model.feed, w, false))), true));
            parent._paragraph("Gennemsnit søvn: " + dom_1.formatTime(new Date(model_1.average(model_1.sliceWindow(model.sleep, w, false))), true));
            parent._paragraph("Total søvn: " + dom_1.formatTime(new Date(model_1.total(model_1.sliceWindow(model.sleep, w, true))), true));
            parent._paragraph("Gennemsnit vågen: " + dom_1.formatTime(new Date(model_1.average(model_1.invert(model_1.sliceWindow(model.sleep, w, false)))), true));
            const img = parent._div()._img("resources/apple-icon-180x180.png");
            tickFuns.anim = () => {
                twerp += 0.01;
                img.style.marginLeft = ((window.innerWidth - 200) * (0.5 + Math.cos(twerp) / 2)) + "px";
                /*
                img.style.width = (90 + 90 * (0.5 + Math.cos(10*twerp)/2)) + "px";
                img.style.height = "auto";
                */
            };
        });
    }
    let twerp = 0.0;
});
