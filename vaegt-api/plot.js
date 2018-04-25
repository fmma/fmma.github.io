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
    exports.series = [];
    exports.target = [];
    function setSeries(s, t) {
        exports.series = s;
        exports.target = t;
    }
    exports.setSeries = setSeries;
    function makeSite(parent) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield series_1.loadSeriesWithTarget(series_1.sessionSeriesName());
            exports.series = data.series;
            exports.target = data.target;
            makePlot(parent);
            menu_1.makeMenu(parent)._class("big");
        });
    }
    exports.makeSite = makeSite;
    function makePlot(parent) {
        parent._svg();
        redrawSized(window.innerWidth - 20, Math.min(window.innerWidth - 70, window.innerHeight - 70));
    }
    exports.makePlot = makePlot;
    function redrawSized(width, height) {
        const leftBorder = 50;
        const rightBorder = 0;
        const topBorder = 0;
        const botBorder = 50;
        const minT = Math.min(...exports.series.map(p => p.t.getTime()), ...exports.target.map(p => p.t.getTime()));
        const maxT = Math.max(...exports.series.map(p => p.t.getTime()), ...exports.target.map(p => p.t.getTime()));
        const minW = Math.min(...exports.series.map(p => p.w), ...exports.target.map(p => p.w));
        const maxW = Math.max(...exports.series.map(p => p.w), ...exports.target.map(p => p.w));
        const timeScale = d3.scaleTime()
            .domain([minT, maxT])
            .range([0, width - leftBorder - rightBorder]);
        const weightScale = d3.scaleLinear()
            .domain([minW, maxW])
            .range([height - topBorder - botBorder, 0]);
        const canvas = d3.select('svg')
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
        plotSeries("steelblue", exports.series, plot, timeScale, weightScale);
        plotSeries("red", exports.target, plot, timeScale, weightScale);
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
