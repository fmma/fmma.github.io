var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../dom", "d3", "../webpart"], function (require, exports, dom_1, d3, webpart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GanttPlot extends webpart_1.Page {
        constructor() {
            super(...arguments);
            this.showInfoBox = false;
            this.reso = new Date(12 * 3600 * 1000);
            this.offset = 0;
        }
        makeSite() {
            return __awaiter(this, void 0, void 0, function* () {
                this.div.style.position = "relative";
                const svg = this.div._svg();
                let init = 0;
                let initY = 0;
                let zooming = false;
                let oldoffset = this.offset;
                let oldscale = this.reso.getTime();
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
                    this.offset = oldoffset + difx * (oldscale / window.innerWidth) + dify * (oldscale / window.innerWidth);
                    // offset = oldoffset + difx * (oldscale / 400)
                    this.reso.setTime(oldscale + dify * (oldscale / 200));
                    window.requestAnimationFrame(() => {
                        this.drawGanttPlot(svg);
                    });
                });
                svg.addEventListener("mouseup", () => {
                    oldoffset = this.offset;
                    oldscale = this.reso.getTime();
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
                        this.offset = oldoffset + difx * (oldscale / window.innerWidth);
                    }
                    else if (te.touches.length === 2 && zooming) {
                        const difx = (init - Math.abs(te.touches[0].clientX - te.touches[1].clientX));
                        this.offset = oldoffset + difx * (oldscale / 400);
                        this.reso.setTime(oldscale + difx * (oldscale / 200));
                    }
                    window.requestAnimationFrame(() => {
                        this.drawGanttPlot(svg);
                    });
                });
                svg.addEventListener("touchend", () => {
                    oldoffset = this.offset;
                    oldscale = this.reso.getTime();
                });
                this.canvas = d3.select(svg);
                this.canvas.html("");
                this.canvas
                    .on("mousedown touchstart", () => {
                    if (!this.showInfoBox)
                        this.infobox.attr("visibility", "hidden");
                    this.showInfoBox = false;
                });
                this.plot = this.canvas.append("g");
                this.xaxis = this.canvas.append("g");
                this.grid = this.canvas.append("g");
                this.feedsHV = this.canvas.selectAll("foobar").data(this.model.feed).enter().append("path");
                this.sleeps = this.canvas.selectAll("bar").data(this.model.sleep).enter().append("rect");
                this.infobox = this.canvas.append("g")
                    .attr("transform", "translate(" + 0 + ", " + 0 + ")")
                    .attr("visibility", "hidden");
                this.infoboxrect = this.infobox.append("rect")
                    .attr("fill", "white")
                    .attr("width", "200pt")
                    .attr("height", "32pt")
                    .attr('stroke', 'black')
                    .attr('stroke-dasharray', '10,5')
                    .attr('stroke-linecap', 'butt')
                    .attr('stroke-width', '3');
                this.infoboxtext = this.infobox.append("text")
                    .attr("x", "100pt")
                    .attr("y", "16pt")
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "central")
                    .text("22:33:22");
                this.drawGanttPlot(svg);
                this.tick.drawGanttPlot = () => this.drawGanttPlot(svg);
            });
        }
        drawGanttPlot(svg) {
            const leftBorder = 50;
            const rightBorder = 0;
            const topBorder = 0;
            const botBorder = 50;
            const width = window.innerWidth;
            const height = Math.min(width / 2.5, 400) + topBorder + botBorder;
            const today = new Date().getTime();
            const minT = this.offset + today - this.reso.getTime(); // Math.min(Math.min(... model.sleep.map(p => p.t0)), Math.min(... model.feed.map(p => p.t0))) - 10000;
            const maxT = this.offset + today;
            this.canvas.attr('width', width);
            this.canvas.attr('height', height);
            this.plot.attr("transform", "translate(" + leftBorder + ", " + topBorder + ")");
            const timeScale = d3.scaleTime()
                .domain([minT, maxT])
                .range([0, width - leftBorder - rightBorder]);
            this.xaxis.attr("class", "xaxis")
                .attr("transform", "translate(" + leftBorder + ", " + (height - botBorder) + ")")
                .call(d3.axisBottom(timeScale)
                .tickPadding(10));
            const qq = this.canvas.selectAll(".xaxis text");
            qq.attr("transform", function (d) {
                return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height + ")rotate(-45)";
            });
            this.grid.attr("class", "grid")
                .attr("transform", "translate(" + leftBorder + ", " + (height - topBorder - botBorder) + ")")
                .attr("opacity", "0.1")
                .call(d3.axisBottom(timeScale)
                .tickSize(-(height - topBorder - botBorder)));
            const barHeight = (height - botBorder) / 4;
            const line = d3.line()
                .x(([x, y]) => leftBorder + timeScale(x))
                .y(([x, y]) => topBorder + y * barHeight);
            this.feedsHV
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
                this.showInfoBox = true;
                const len = dom_1.formatTime(new Date((p.t1 || today) - p.t0), true, false);
                const sta = dom_1.formatTime(new Date(p.t0), false, false);
                const end = dom_1.formatTime(new Date((p.t1 || today)), false, false);
                this.infoboxtext.text(sta + " - " + end + " (" + len + ")");
                this.infobox.attr("visibility", "visible");
            });
            this.sleeps
                .style("fill", "red")
                .attr("x", p => leftBorder + timeScale(p.t0))
                .attr("width", p => 1 + timeScale((p.t1 || new Date().getTime())) - timeScale(p.t0))
                .attr("y", d => topBorder + 3 * barHeight)
                .attr("height", d => barHeight)
                .on("mousedown touchstart", (p, i, rs) => {
                this.showInfoBox = true;
                const len = dom_1.formatTime(new Date((p.t1 || today) - p.t0), true, false);
                const sta = dom_1.formatTime(new Date(p.t0), false, false);
                const end = dom_1.formatTime(new Date((p.t1 || today)), false, false);
                this.infoboxtext.text(sta + " - " + end + " (" + len + ")");
                this.infobox.attr("visibility", "visible");
            });
        }
    }
    exports.GanttPlot = GanttPlot;
    exports.default = GanttPlot;
});
