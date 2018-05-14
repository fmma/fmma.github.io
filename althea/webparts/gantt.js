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
    class D3Elements {
        constructor(canvas, plot, xaxis, grid, feeds, sleeps, infobox, infoboxText) {
            this.canvas = canvas;
            this.plot = plot;
            this.xaxis = xaxis;
            this.grid = grid;
            this.feeds = feeds;
            this.sleeps = sleeps;
            this.infobox = infobox;
            this.infoboxText = infoboxText;
        }
    }
    class GanttPlot extends webpart_1.Webpart {
        constructor() {
            super(...arguments);
            this.d3Elements = null;
            this.leftBorder = 50;
            this.rightBorder = 0;
            this.topBorder = 0;
            this.botBorder = 50;
            this.width = 0;
            this.height = 0;
            this.barHeight = 0;
            this.showInfoBox = false;
            this.reso = new Date(12 * 3600 * 1000);
            this.offset = 0;
        }
        dom() {
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
                    me.stopImmediatePropagation();
                    init = me.clientX;
                    initY = me.clientY;
                    zooming = true;
                });
                svg.addEventListener("mousemove", (e) => {
                    const me = e;
                    me.stopImmediatePropagation();
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
                    te.stopImmediatePropagation();
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
                    te.stopImmediatePropagation();
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
                const canvas = d3.select(svg);
                canvas.html("");
                canvas
                    .on("mousedown touchstart", () => {
                    if (this.d3Elements == null)
                        return;
                    if (!this.showInfoBox)
                        this.d3Elements.infobox.attr("visibility", "hidden");
                    this.showInfoBox = false;
                });
                const plot = canvas.append("g");
                const xaxis = canvas.append("g");
                const grid = canvas.append("g");
                const feeds = canvas.selectAll("foobar").data(this.model.feed).enter().append("path");
                const sleeps = canvas.selectAll("bar").data(this.model.sleep).enter().append("rect");
                const infobox = canvas.append("g")
                    .attr("transform", "translate(" + 0 + ", " + 0 + ")")
                    .attr("visibility", "hidden");
                const infoboxRect = infobox.append("rect")
                    .attr("fill", "white")
                    .attr("width", "200pt")
                    .attr("height", "32pt")
                    .attr('stroke', 'black')
                    .attr('stroke-dasharray', '10,5')
                    .attr('stroke-linecap', 'butt')
                    .attr('stroke-width', '3');
                const infoboxText = infobox.append("text")
                    .attr("x", "100pt")
                    .attr("y", "16pt")
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "central")
                    .text("22:33:22");
                this.d3Elements = new D3Elements(canvas, plot, xaxis, grid, feeds, sleeps, infobox, infoboxText);
                this.width = window.innerWidth - 20;
                this.height = Math.min(this.width / 2.5, 400) + this.topBorder + this.botBorder;
                this.barHeight = (this.height - this.botBorder) / 4;
                this.d3Elements.canvas.attr('width', this.width);
                this.d3Elements.canvas.attr('height', this.height);
                this.d3Elements.plot.attr("transform", "translate(" + this.leftBorder + ", " + this.topBorder + ")");
                this.d3Elements.xaxis
                    .attr("class", "xaxis")
                    .attr("transform", "translate(" + this.leftBorder + ", " + (this.height - this.botBorder) + ")");
                this.d3Elements.grid
                    .attr("class", "grid")
                    .attr("transform", "translate(" + this.leftBorder + ", " + (this.height - this.topBorder - this.botBorder) + ")")
                    .attr("opacity", "0.1");
                this.d3Elements.sleeps
                    .style("fill", "red")
                    .attr("y", d => this.topBorder + 3 * this.barHeight)
                    .attr("height", d => this.barHeight)
                    .on("mousedown touchstart", (p, i) => {
                    this.clickPeriod(new Date().getTime(), p);
                });
                this.d3Elements.feeds
                    .attr("stroke", "steelblue")
                    .attr("fill", "steelblue")
                    .on("mousedown touchstart", (p, i) => {
                    this.clickPeriod(new Date().getTime(), p);
                });
                this.drawGanttPlot(svg);
                // this.ticks.drawGanttPlot = () => this.drawGanttPlot(svg);
            });
        }
        drawGanttPlot(svg) {
            if (this.d3Elements == null)
                return;
            const today = new Date().getTime();
            const minT = this.offset + today - this.reso.getTime(); // Math.min(Math.min(... model.sleep.map(p => p.t0)), Math.min(... model.feed.map(p => p.t0))) - 10000;
            const maxT = this.offset + today;
            const timeScale = d3.scaleTime()
                .domain([minT, maxT])
                .range([0, this.width - this.leftBorder - this.rightBorder]);
            this.d3Elements.xaxis
                .call(d3.axisBottom(timeScale)
                .ticks(4)
                .tickPadding(10));
            const xAxisTexts = this.d3Elements.canvas.selectAll(".xaxis text");
            xAxisTexts.attr("transform", function (d) {
                return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height + ")rotate(-45)";
            });
            this.d3Elements.grid
                .call(d3.axisBottom(timeScale)
                .tickSize(-(this.height - this.topBorder - this.botBorder)));
            const line = d3.line()
                .x(([x, y]) => this.leftBorder + timeScale(x))
                .y(([x, y]) => this.topBorder + y * this.barHeight);
            this.d3Elements.feeds
                .attr("d", p => line([[p.t0, 1],
                [p.t0 - (p.v ? 400000 : 0), 1.5],
                [p.t0, 2],
                [p.t1 || today, 2],
                [(p.t1 || today) + (p.h ? 400000 : 0), 1.5],
                [p.t1 || today, 1]
            ]));
            this.d3Elements.sleeps
                .attr("x", p => this.leftBorder + timeScale(p.t0))
                .attr("width", p => 1 + timeScale((p.t1 || new Date().getTime())) - timeScale(p.t0));
        }
        clickPeriod(today, p) {
            if (this.d3Elements == null)
                return;
            this.showInfoBox = true;
            const len = dom_1.formatTime(new Date((p.t1 || today) - p.t0), true, false);
            const sta = dom_1.formatTime(new Date(p.t0), false, false);
            const end = dom_1.formatTime(new Date((p.t1 || today)), false, false);
            this.d3Elements.infoboxText.text(sta + " - " + end + " (" + len + ")");
            this.d3Elements.infobox.attr("visibility", "visible");
        }
    }
    exports.GanttPlot = GanttPlot;
    exports.default = GanttPlot;
});
