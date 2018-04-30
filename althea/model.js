define(["require", "exports", "aws-sdk"], function (require, exports, aws) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const userID = "althea";
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
    function loadModel() {
        if (seriesCache[userID])
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
