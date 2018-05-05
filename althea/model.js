define(["require", "exports", "aws-sdk"], function (require, exports, aws) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const userID = "althea";
    function sliceWindow(series, p, cutoff) {
        const today = new Date().getTime();
        const result = series.filter(p0 => p0.t0 < (p.t1 || today) && p.t0 < (p0.t1 || today));
        if (cutoff && result.length > 0) {
            result[0] =
                { t0: result[0].t0 < p.t0 ? p.t0 : result[0].t0,
                    t1: result[0].t1
                };
            result[result.length - 1] =
                { t0: result[result.length - 1].t0,
                    t1: (result[result.length - 1].t1 || today) > (p.t1 || today) ? (p.t1 || today) : (result[result.length - 1].t1 || today)
                };
        }
        return result;
    }
    exports.sliceWindow = sliceWindow;
    function closed(series) {
        const result = [];
        for (let i = 0; i < series.length; ++i) {
            const p = series[i];
            if (p.t1 != null) {
                result.push({ t0: p.t0, t1: p.t1 });
            }
        }
        return result;
    }
    exports.closed = closed;
    function invert(series) {
        const result = [];
        if (series.length === 0)
            return result;
        let t = series[0].t1;
        for (let i = 0; i < series.length; ++i) {
            const p = series[i];
            if (t != null) {
                result.push({ t0: t, t1: p.t0 });
            }
            t = p.t1;
        }
        return result;
    }
    exports.invert = invert;
    function total(series) {
        const lengths = closed(series).map(({ t0: t0, t1: t1 }) => t1 - t0);
        if (lengths.length === 0)
            return 0;
        return lengths.reduce((a, b) => a + b);
    }
    exports.total = total;
    function average(series) {
        const lengths = closed(series).map(({ t0: t0, t1: t1 }) => t1 - t0);
        if (lengths.length === 0)
            return 0;
        return lengths.reduce((a, b) => a + b) / lengths.length;
    }
    exports.average = average;
    function saveModel(model) {
        if (location.hostname == "localhost") {
            console.warn("Hostname is localhost. Save will not persist.");
            seriesCache[name] = model;
            return;
        }
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
            Key: { "userID": userID },
            UpdateExpression: "set m = :m",
            ExpressionAttributeValues: {
                ":m": model
            },
            ReturnValues: "UPDATED_NEW"
        };
        seriesCache[name] = model;
        docClient.update(updateParams, (err, data) => {
            if (err) {
                console.log("Error JSON: " + JSON.stringify(err) + "\n");
            }
            else {
                console.log("PutItem succeeded: " + data + "\n");
            }
        });
    }
    exports.saveModel = saveModel;
    var seriesCache = {};
    function loadModel(force) {
        if (!force && seriesCache[userID])
            return Promise.resolve(seriesCache[userID]);
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
                    "userID": userID
                }
            };
            docClient.get(params, function (err, data) {
                if (err) {
                    reject("Unable to read item: " + "\n" + JSON.stringify(err, undefined, 2));
                }
                else {
                    if (data.Item != null) {
                        const model = data.Item["m"];
                        /*
                        model.feed.forEach(p => {
                            p.h = Boolean(Math.round(Math.random()));
                            p.v = Boolean(Math.round(Math.random()));
                        })*/
                        model.dirty = false;
                        seriesCache[userID] = model;
                        resolve(model);
                    }
                    else {
                        reject("No item");
                    }
                }
            });
        });
    }
    exports.loadModel = loadModel;
});
