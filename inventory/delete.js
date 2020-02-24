'use strict';

module.exports.delete = (event, context, callback) => {
    
    var AWS = require("aws-sdk");

    var dynamoDB = new AWS.DynamoDB.DocumentClient();


    var params = {
        TableName: INVENTORY_TABLE,
        Key: {
            id: event.pathParameters.id
        }
    };

    dynamoDB.delete(params, function (err, data) {
        if (err) {
            callback(JSON.stringify(err, null, 2));
        } else {
            const response = {
                statusCode: 200,
                body: null,
            };
            callback(null, response);
        }
    });
};