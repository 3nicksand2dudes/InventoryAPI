'use strict';

var AWS = require("aws-sdk");

var dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.modify = (event, context, callback) => {
    var params = {
        TableName: INVENTORY_TABLE,
    Key: {
        id: event.pathParameters.id
    },
        ExpressionAttributeNames: {
        //TODO Right parameters here
      '#product_name': 'name',
    },
        ExpressionAttributeValues: {
        //TODO right parameters here
      ":name": data.name,
      ":description": data.description
    },
    UpdateExpression: 'SET #product_name=:name, description=:description',
    ReturnValues: "UPDATED_NEW"
  };

    dynamoDB.update(params, function (err, result) {
    if (err) {
      callback(JSON.stringify(err, null, 2));
    } else {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Attributes),
      };
      callback(null, response);
    }
  });
};