var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "aws-sdk"], function (require, exports, aws) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function parseSeries(data) {
        return data.split("\n")
            .map(x => {
            const [t, w] = x.split(",");
            return { t: isNaN(+t) ? new Date(t) : new Date(+t), w: +w };
        })
            .filter(x => x.t.getTime() > 0 && !isNaN(x.w));
    }
    exports.parseSeries = parseSeries;
    function formatSeries(series) {
        return series.map(p => p.t.getTime() + ", " + p.w).join("\n");
    }
    exports.formatSeries = formatSeries;
    function sessionSeriesName() {
        let res = "";
        window.location.search.substr(1).split("&").forEach(param => {
            const [x, v] = param.split("=");
            if (x === "series")
                res = v;
        });
        return res;
    }
    exports.sessionSeriesName = sessionSeriesName;
    function loadSeriesWithTarget(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const series = yield loadSeries(name);
            const target = yield loadSeries(name + "_target");
            return {
                series: series,
                target: target
            };
        });
    }
    exports.loadSeriesWithTarget = loadSeriesWithTarget;
    function loadSeries_old(name) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.onload = e => {
                resolve(parseSeries(req.response));
            };
            req.open("GET", "/?series=" + name);
            req.setRequestHeader("Content-Type", "text/plain");
            req.send();
        });
    }
    exports.loadSeries_old = loadSeries_old;
    function saveSeries_old(series, name) {
        series.sort((a, b) => a.t.getTime() - b.t.getTime());
        const req = new XMLHttpRequest();
        req.onload = e => {
            console.log(req.response);
        };
        req.open("PUT", "/put/?series=" + name);
        req.setRequestHeader("Content-Type", "text/plain");
        req.send(formatSeries(series));
    }
    exports.saveSeries_old = saveSeries_old;
    function appendSeries_old(weight, name) {
        const val = weight;
        if (isNaN(+val)) {
            alert("Vægten skal være et tal mellem 50 og 200");
            return;
        }
        const req = new XMLHttpRequest();
        req.onload = e => {
            console.log(req.response);
        };
        req.open("POST", "/post" + window.location.search);
        req.setRequestHeader("Content-Type", "text/plain");
        req.send(val);
    }
    exports.appendSeries_old = appendSeries_old;
    function saveSeries(series, name) {
        const docClient = new aws.DynamoDB.DocumentClient({
            region: "eu-west-1",
            endpoint: "https://dynamodb.eu-west-1.amazonaws.com",
            convertEmptyValues: true,
            accessKeyId: "AKIAIWAB4KO6GED7WCIQ",
            // secretAccessKey default can be used while using the downloadable version of DynamoDB. 
            // For security reasons, do not store aws Credentials in your files. Use Amazon Cognito instead.
            secretAccessKey: "apevBQ09w3Z3FjuOPjFLUPlO92KB6+PhKmlCkfWB"
        });
        const updateParams = {
            TableName: "vaegt-api",
            Key: { "userID": name },
            UpdateExpression: "set d = :d",
            ExpressionAttributeValues: {
                ":d": flatten(series.map(p => [p.t.getTime(), p.w]))
            },
            ReturnValues: "UPDATED_NEW"
        };
        delete seriesCache[name];
        docClient.update(updateParams, (err, data) => {
            if (err) {
                console.log("Error JSON: " + JSON.stringify(err) + "\n");
            }
            else {
                console.log("PutItem succeeded: " + data + "\n");
            }
        });
    }
    exports.saveSeries = saveSeries;
    var seriesCache = {};
    function loadSeries(name) {
        if (seriesCache[name])
            return Promise.resolve(seriesCache[name]);
        return new Promise((resolve, reject) => {
            const docClient = new aws.DynamoDB.DocumentClient({
                region: "eu-west-1",
                endpoint: "https://dynamodb.eu-west-1.amazonaws.com",
                convertEmptyValues: true,
                accessKeyId: "AKIAIWAB4KO6GED7WCIQ",
                secretAccessKey: "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"
            });
            var params = {
                TableName: "vaegt-api",
                Key: {
                    "userID": name
                }
            };
            docClient.get(params, function (err, data) {
                if (err) {
                    reject("Unable to read item: " + "\n" + JSON.stringify(err, undefined, 2));
                }
                else {
                    if (data.Item != null) {
                        const numbers = data.Item["d"];
                        const numberss = partition(numbers, 2);
                        const points = numberss.map(tw => ({ t: new Date(tw[0]), w: tw[1] }));
                        seriesCache[name] = points;
                        resolve(points);
                    }
                    else {
                        reject("No item");
                    }
                }
            });
        });
    }
    exports.loadSeries = loadSeries;
    function appendSeries(weight, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const s = yield loadSeries(name);
            s.push({ t: new Date(), w: +weight });
            saveSeries(s, name);
        });
    }
    exports.appendSeries = appendSeries;
    /// UTILITY
    function flatten(xss) {
        return [].concat.apply([], xss);
    }
    exports.flatten = flatten;
    function partition(items, size) {
        const p = [];
        for (var i = Math.floor(items.length / size); i-- > 0;) {
            p[i] = items.slice(i * size, (i + 1) * size);
        }
        return p;
    }
    exports.partition = partition;
    function interpolate(date, series, index) {
        const t = date.getTime();
        if (index == null)
            index = { i: 0 };
        let i = index.i;
        let p0 = series[i];
        let p1 = series[i + 1];
        if (series.length - i < 2 || p0.t.getTime() > t) {
            return null;
        }
        for (; i < series.length; ++i) {
            if (t < p1.t.getTime()) {
                break;
            }
            else {
                p0 = p1;
                p1 = series[i];
            }
        }
        index.i = i;
        const t0 = p0.t.getTime();
        const t1 = p1.t.getTime();
        const w = (t1 - t) * p0.w / (t1 - t0) + (t - t0) * p1.w / (t1 - t0);
        return t >= t0 && t <= t1 ? { t: date, w: w } : null;
    }
    exports.interpolate = interpolate;
});
