var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./series", "d3", "./menu"], function (require, exports, series_1, d3, menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let plotZoom = 0;
    const plotZoomOptions = [{ display: "Alle tider", pre: -1 },
        { display: "24 timer", pre: 24 },
        { display: "2 dage", pre: 24 * 2 },
        { display: "3 dage", pre: 24 * 3 },
        { display: "4 dage", pre: 24 * 4 },
        { display: "5 dage", pre: 24 * 5 },
        { display: "6 dage", pre: 24 * 6 },
        { display: "7 dage", pre: 24 * 7 },
        { display: "2 uger", pre: 2 * 24 * 7 },
        { display: "3 uger", pre: 3 * 24 * 7 },
        { display: "4 uger", pre: 4 * 24 * 7 },
        { display: "2 måneder", pre: 2 * 24 * 30 },
        { display: "3 måneder", pre: 3 * 24 * 30 },
        { display: "4 måneder", pre: 4 * 24 * 30 },
        { display: "5 måneder", pre: 5 * 24 * 30 },
        { display: "6 måneder", pre: 6 * 24 * 30 },
        { display: "7 måneder", pre: 7 * 24 * 30 },
        { display: "8 måneder", pre: 8 * 24 * 30 },
        { display: "9 måneder", pre: 9 * 24 * 30 },
        { display: "10 måneder", pre: 10 * 24 * 30 },
        { display: "11 måneder", pre: 11 * 24 * 30 },
        { display: "12 måneder", pre: 12 * 24 * 30 },
        { display: "2 år", pre: 2 * 12 * 24 * 30 },
        { display: "3 år", pre: 3 * 12 * 24 * 30 },
        { display: "4 år", pre: 4 * 12 * 24 * 30 },
        { display: "5 år", pre: 5 * 12 * 24 * 30 }];
    function makeSite(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield series_1.loadSeriesWithTarget(series_1.sessionSeriesName());
            const svg = makePlot([data.series, data.target, []], parent);
            const indexState = { i: 0 };
            const diffSeries = [];
            for (let i = 0; i < data.series.length; ++i) {
                const p = series_1.interpolate(data.series[i].t, data.target, indexState);
                console.log(p);
                if (p != null) {
                    diffSeries.push({ t: p.t, w: data.series[i].w - p.w });
                }
                else {
                }
            }
            let showDiff = false;
            let showTarget = true;
            let showSeries = true;
            parent._text("Vægt: ");
            parent._checkbox(showSeries, b => {
                showSeries = b;
                redrawFit([showSeries ? data.series : [],
                    showTarget ? data.target : [],
                    showDiff ? diffSeries : []], svg);
            });
            parent._text(" Target: ");
            parent._checkbox(showTarget, b => {
                showTarget = b;
                redrawFit([showSeries ? data.series : [],
                    showTarget ? data.target : [],
                    showDiff ? diffSeries : []], svg);
            });
            parent._text(" Diff: ");
            parent._checkbox(showDiff, b => {
                showDiff = b;
                redrawFit([showSeries ? data.series : [],
                    showTarget ? data.target : [],
                    showDiff ? diffSeries : []], svg);
            });
            parent._select(plotZoomOptions.map(x => x.display), plotZoom, i => {
                plotZoom = i;
                redrawFit([showSeries ? data.series : [],
                    showTarget ? data.target : [],
                    showDiff ? diffSeries : []], svg);
            });
            menu_1.makeMenu(parent)._class("big");
        });
    }
    exports.makeSite = makeSite;
    function makePlot(serieses, parent) {
        const svg = parent._svg();
        redrawFit(serieses, svg);
        let w = window.outerWidth;
        let h = window.outerHeight;
        window.onorientationchange = () => redrawFit(serieses, svg);
        window.onresize = () => {
            if (!(w === window.outerWidth && h === window.outerHeight)) {
                w = window.outerWidth;
                h = window.outerHeight;
                redrawFit(serieses, svg);
            }
        };
        return svg;
    }
    exports.makePlot = makePlot;
    function redrawFit(serieses, svg) {
        const w = window.innerWidth - 20;
        const h = Math.min(window.innerWidth - 70, window.innerHeight / 2);
        redrawSized(serieses, svg, w, h);
    }
    exports.redrawFit = redrawFit;
    function getMinT(serieses) {
        if (plotZoom == 0)
            return Math.min(...serieses.map(series => Math.min(...series.map(p => p.t.getTime()))));
        const today = new Date().getTime();
        return today - 60 * 60 * 1000 * plotZoomOptions[plotZoom].pre;
    }
    function getMaxT(serieses) {
        const maxmax = Math.max(...serieses.map(series => Math.max(...series.map(p => p.t.getTime()))));
        if (plotZoom == 0)
            return maxmax;
        const today = new Date().getTime();
        return Math.min(maxmax, today + 60 * 60 * 1000 * plotZoomOptions[plotZoom].pre);
    }
    function redrawSized(serieses, svg, width, height) {
        if (svg == null)
            return;
        const leftBorder = 50;
        const rightBorder = 0;
        const topBorder = 0;
        const botBorder = 50;
        const minT = getMinT(serieses);
        const maxT = getMaxT(serieses);
        serieses = serieses.map(series => {
            const newSeries = series.filter(p => p.t.getTime() >= minT && p.t.getTime() <= maxT);
            const first = series_1.interpolate(new Date(minT), series);
            const last = series_1.interpolate(new Date(maxT), series);
            if (first)
                newSeries.push(first);
            if (last)
                newSeries.push(last);
            newSeries.sort((a, b) => a.t.getTime() - b.t.getTime());
            return newSeries;
        });
        const minW = Math.min(...serieses.map(series => Math.min(...series.map(p => p.w))));
        const maxW = Math.max(...serieses.map(series => Math.max(...series.map(p => p.w))));
        const timeScale = d3.scaleTime()
            .domain([minT, maxT])
            .range([0, width - leftBorder - rightBorder]);
        const weightScale = d3.scaleLinear()
            .domain([minW, maxW])
            .range([height - topBorder - botBorder, 0]);
        const canvas = d3.select(svg)
            .attr('width', width)
            .attr('height', height);
        canvas.html("");
        const plot = canvas.append("g")
            .attr("transform", "translate(" + leftBorder + ", " + topBorder + ")");
        const xAxis = d3.axisLeft(weightScale).tickPadding(10);
        canvas.append("g")
            .attr("transform", "translate(" + leftBorder + ", " + topBorder + ")")
            .call(xAxis);
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
            .attr("transform", "translate(" + leftBorder + ", " + topBorder + ")")
            .attr("opacity", "0.1")
            .call(d3.axisLeft(weightScale)
            .tickSize(-(width - leftBorder - rightBorder)));
        canvas.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(" + leftBorder + ", " + (height - topBorder - botBorder) + ")")
            .attr("opacity", "0.1")
            .call(d3.axisBottom(timeScale)
            .tickSize(-(height - topBorder - botBorder)));
        const colors = ["steelblue", "red", "green"];
        for (let i = 0; i < serieses.length; ++i) {
            plotSeries(colors[i], serieses[i], plot, timeScale, weightScale);
        }
    }
    exports.redrawSized = redrawSized;
    function plotSeries(color, series, canvas, timeScale, weightScale) {
        const line = d3.line()
            .x(d => timeScale(d.t))
            .y(d => weightScale(d.w));
        canvas.append("path")
            .datum(series)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1)
            .attr("d", line);
    }
});
