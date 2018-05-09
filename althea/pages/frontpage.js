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
    const nextTimeSleep = 1.5;
    const nextTimeFeed = 2.75;
    let iv;
    function makeSite(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const div = parent._div();
            const model = yield model_1.loadModel(false);
            drawSite(div, model, new Date(12 * 3600 * 1000) /*12 hours*/, 0);
            let mayorTick = 0;
            iv = setInterval(() => {
                if (!document.hidden) {
                    mayorTick++;
                    if (mayorTick === 10) {
                        mayorTick = 0;
                        // tickFuns.reloadModel();
                    }
                    tickFuns.sleepTotal();
                    tickFuns.sleep();
                    tickFuns.feed();
                    tickFuns.sleepNext();
                    tickFuns.feedNext();
                }
            }, 1000);
            let lastTick = new Date().getTime();
            document.addEventListener("visibilitychange", function () {
                if (!document.hidden) {
                    const t = new Date().getTime();
                    if (t - lastTick > 10000) {
                        lastTick = t;
                        tickFuns.reloadModel();
                    }
                }
            });
            const f = () => {
                tickFuns.anim();
                // tickFuns.drawGanttPlot(); TODO heavy
                animFix();
            };
            const animFix = () => {
                window.requestAnimationFrame(f);
            };
            animFix();
        });
    }
    exports.makeSite = makeSite;
    const tickFuns = {
        sleepTotal: () => { },
        sleep: () => { },
        feed: () => { },
        sleepNext: () => { },
        feedNext: () => { },
        anim: () => { },
        drawGanttPlot: () => { },
        reloadModel: () => { }
    };
    let offset = 0;
    function drawSite(parent, model, reso, avgMode) {
        tickFuns.reloadModel = () => __awaiter(this, void 0, void 0, function* () {
            const newModel = yield model_1.loadModel(true);
            drawSite(parent, newModel, reso, avgMode);
        });
        function makeGantt() {
            function drawGanttPlot(svg) {
                const leftBorder = 50;
                const rightBorder = 0;
                const topBorder = 0;
                const botBorder = 50;
                const width = window.innerWidth;
                const height = Math.min(width / 2.5, 400) + topBorder + botBorder;
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
                const line = d3.line()
                    .x(([x, y]) => leftBorder + timeScale(x))
                    .y(([x, y]) => topBorder + y * barHeight);
                feedsHV
                    .attr("d", p => line([[p.t0, 1],
                    [p.t0 - (p.v ? 400000 : 0), 1.5],
                    [p.t0, 2],
                    [p.t1 || today, 2],
                    [(p.t1 || today) + (p.h ? 400000 : 0), 1.5],
                    [p.t1 || today, 1]
                ]))
                    .attr("stroke", "steelblue")
                    .attr("fill", "steelblue")
                    .on("mousedown touchstart", (p, i, rs) => {
                    showInfobox = true;
                    const len = dom_1.formatTime(new Date((p.t1 || today) - p.t0), true, false);
                    const sta = dom_1.formatTime(new Date(p.t0), false, false);
                    const end = dom_1.formatTime(new Date((p.t1 || today)), false, false);
                    infoboxtext.text(sta + " - " + end + " (" + len + ")");
                    infobox.attr("visibility", "visible");
                });
                sleeps
                    .style("fill", "red")
                    .attr("x", p => leftBorder + timeScale(p.t0))
                    .attr("width", p => 1 + timeScale((p.t1 || new Date().getTime())) - timeScale(p.t0))
                    .attr("y", d => topBorder + 3 * barHeight)
                    .attr("height", d => barHeight)
                    .on("mousedown touchstart", (p, i, rs) => {
                    showInfobox = true;
                    const len = dom_1.formatTime(new Date((p.t1 || today) - p.t0), true, false);
                    const sta = dom_1.formatTime(new Date(p.t0), false, false);
                    const end = dom_1.formatTime(new Date((p.t1 || today)), false, false);
                    infoboxtext.text(sta + " - " + end + " (" + len + ")");
                    infobox.attr("visibility", "visible");
                });
            }
            const div = parent._div();
            div.style.position = "relative";
            const svg = div._svg();
            let init = 0;
            let initY = 0;
            let zooming = false;
            let oldoffset = offset;
            let oldscale = reso.getTime();
            svg.addEventListener("mousedown", (e) => {
                const me = e;
                me.preventDefault();
                init = me.clientX;
                initY = me.clientY;
                zooming = true;
            });
            svg.addEventListener("mousemove", (e) => {
                const me = e;
                me.preventDefault();
                if (!zooming)
                    return;
                const difx = init - me.clientX;
                const dify = (initY - me.clientY);
                offset = oldoffset + difx * (oldscale / window.innerWidth) + dify * (oldscale / window.innerWidth);
                // offset = oldoffset + difx * (oldscale / 400)
                reso.setTime(oldscale + dify * (oldscale / 200));
                window.requestAnimationFrame(() => {
                    drawGanttPlot(svg);
                });
            });
            svg.addEventListener("mouseup", () => {
                oldoffset = offset;
                oldscale = reso.getTime();
                zooming = false;
            });
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
                    offset = oldoffset + difx * (oldscale / window.innerWidth);
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
            let showInfobox = false;
            canvas.html("");
            canvas
                .on("mousedown touchstart", () => {
                if (!showInfobox)
                    infobox.attr("visibility", "hidden");
                showInfobox = false;
            });
            const plot = canvas.append("g");
            const xaxis = canvas.append("g");
            const grid = canvas.append("g");
            const feedsHV = canvas.selectAll("foobar").data(model.feed).enter().append("path");
            const sleeps = canvas.selectAll("bar").data(model.sleep).enter().append("rect");
            const infobox = canvas.append("g")
                .attr("transform", "translate(" + 0 + ", " + 0 + ")")
                .attr("visibility", "hidden");
            const infoboxrect = infobox.append("rect")
                .attr("fill", "white")
                .attr("width", "200pt")
                .attr("height", "32pt")
                .attr('stroke', 'black')
                .attr('stroke-dasharray', '10,5')
                .attr('stroke-linecap', 'butt')
                .attr('stroke-width', '3');
            const infoboxtext = infobox.append("text")
                .attr("x", "100pt")
                .attr("y", "16pt")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "central")
                .text("22:33:22");
            drawGanttPlot(svg);
            tickFuns.drawGanttPlot = () => drawGanttPlot(svg);
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
            const width4 = "50%";
            const displayName = key === "sleep" ? "Søvn" : "Amning";
            const nextTime = key === "sleep" ? nextTimeSleep : nextTimeFeed;
            const series = model[key];
            const open = series.length > 0 && series[series.length - 1].t1 == null;
            const div = parent._div();
            const div2 = parent._div();
            const tc = timeContainer(div, false, width4);
            tc.style.textAlign = "left";
            tc.style.verticalAlign = "top";
            tc.style.fontVariant = "small-caps";
            tc._text(displayName);
            if (open) {
                const button = div._button("Slut", () => __awaiter(this, void 0, void 0, function* () {
                    series[series.length - 1].t1 = new Date().getTime();
                    button.disabled = true;
                    yield model_1.saveModel(model);
                    button.disabled = false;
                    drawSite(parent, model, reso, avgMode);
                }));
                button.style.width = width4;
                const time = timeContainer(div2, true, width4)._text(dom_1.formatTime(new Date(new Date().getTime() - series[series.length - 1].t0), true));
                tickFuns[key] = () => {
                    time.textContent = dom_1.formatTime(new Date(new Date().getTime() - series[series.length - 1].t0), true);
                    // drawSite(parent, model, reso);
                };
            }
            else {
                const button = div._button("Start", () => __awaiter(this, void 0, void 0, function* () {
                    model[key].push({ t0: new Date().getTime() });
                    button.disabled = true;
                    yield model_1.saveModel(model);
                    button.disabled = false;
                    drawSite(parent, model, reso, avgMode);
                }));
                button.style.width = width4;
                if (series.length > 0) {
                    const t = series[series.length - 1].t1;
                    if (t == null)
                        throw "";
                    const time = timeContainer(div2, false, width4)._text(dom_1.formatTime(new Date(new Date().getTime() - t), true));
                    tickFuns[key] = () => {
                        time.textContent = dom_1.formatTime(new Date(new Date().getTime() - t), true);
                    };
                }
                else {
                    const time = timeContainer(div2, false, width4)._text("");
                    tickFuns[key] = () => { };
                }
            }
            const regret = div2._button("Fortryd", () => __awaiter(this, void 0, void 0, function* () {
                series.pop();
                regret.disabled = true;
                yield model_1.saveModel(model);
                regret.disabled = false;
                drawSite(parent, model, reso, avgMode);
            }));
            regret.hidden = !open;
            regret.style.width = width4;
            if (series.length > 0 && !open) {
                const t = series[series.length - 1].t1;
                if (t) {
                    const cont = timeContainer(div2, false, width4);
                    const d = new Date(t + nextTime * 3600 * 1000);
                    const ttt = cont._text(dom_1.formatTime(d, false));
                    cont.style.background = (key === "sleep") === (new Date().getTime() > d.getTime()) ? "pink" : "lightgreen";
                    tickFuns[key + "Next"] = () => {
                        cont.style.background = (key === "sleep") === (new Date().getTime() > d.getTime()) ? "pink" : "lightgreen";
                    };
                }
                else {
                    const cont = timeContainer(div2, false, width4);
                    cont.hidden = true;
                    cont._text("");
                    tickFuns[key + "Next"] = () => { };
                }
            }
            else {
                const cont = timeContainer(div2, false, width4);
                cont.hidden = true;
                cont._text("");
                tickFuns[key + "Next"] = () => { };
            }
            if (key == "feed") {
                timeContainer(parent, true, width4);
                const hv = timeContainer(parent, false, width4);
                const disabled = !(model.feed.length > 0 && model.feed[model.feed.length - 1].t1 == null);
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
        function makeStatistics() {
            const sel = parent._select(["24 timer", "en uge", "for altid"], avgMode, i => {
                drawSite(parent, model, reso, i);
            });
            const today = new Date().getTime();
            const w = { t0: avgMode == 0 ? today - 24 * 3600 * 1000 : avgMode == 1 ? today - 7 * 24 * 3600 * 1000 : 0, t1: today };
            parent._paragraph("Gennemsnit amning: " + dom_1.formatTime(new Date(model_1.average(model_1.sliceWindow(model.feed, w, false))), true));
            parent._paragraph("Gennemsnit søvn: " + dom_1.formatTime(new Date(model_1.average(model_1.sliceWindow(model.sleep, w, false))), true));
            const sleepTotal = parent._paragraph("Total søvn: " + dom_1.formatTime(new Date(model_1.total(model_1.sliceWindow(model.sleep, w, true))), true));
            tickFuns.sleepTotal = () => {
                const today = new Date().getTime();
                const w = { t0: avgMode == 0 ? today - 24 * 3600 * 1000 : avgMode == 1 ? today - 7 * 24 * 3600 * 1000 : 0, t1: today };
                sleepTotal.textContent = "Total søvn: " + dom_1.formatTime(new Date(model_1.total(model_1.sliceWindow(model.sleep, w, true))), true);
            };
            parent._paragraph("Gennemsnit vågen: " + dom_1.formatTime(new Date(model_1.average(model_1.sliceWindow(model_1.invert(model.sleep), w, false))), true));
            const img = parent._div()._img("resources/apple-icon-180x180.png");
            tickFuns.anim = () => {
                twerp += 0.01;
                img.style.marginLeft = ((window.innerWidth - 200) * (0.5 + Math.cos(twerp) / 2)) + "px";
            };
        }
        parent._draw(() => {
            makeControl("sleep");
            parent._hr();
            makeControl("feed");
            makeGantt();
            parent._h1("Statistik");
            makeStatistics();
            parent._h1("Menu");
            parent._link("Manu ret", "#pages/manu").onclick = () => clearInterval(iv);
        });
    }
    let twerp = 0.0;
});
