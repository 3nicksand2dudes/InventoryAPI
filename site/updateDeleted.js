'use strict'; // Use Strict mode 

const AWS = require('aws-sdk')

const SITE_TABLE  = process.env.SITE_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient()


module.exports.delete = (event, context, callback) => {
    updateDeleted(event, context, callback, true)
}

module.exports.reactivate = (event, context, callback) => {
    updateDeleted(event, context, callback, false)
}


function updateDeleted(event, context, callback, deletedStatus){
    const params = {
        TableName:SITE_TABLE,
        Key: {
            siteId: event.pathParameters.id,
        },
        ExpressionAttributeNames:{
            '#deleted': 'deleted',
        },
        ExpressionAttributeValues:{
            ':deleted': deletedStatus
        },
        ConditionExpression: 'attribute_exists(siteId)',
        UpdateExpression: 'SET #deleted=:deleted',
        ReturnValues: "ALL_NEW"
    }

    dynamoDb.update(params, (error, result) => {

        if (error) {
            if(error.message == 'The conditional request failed'){
                console.error(error)
                callback(null, {
                statusCode: 400,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t update the site. Site does not exist',
                })
                return
            }else{
                console.error(error)
                callback(null, {
                statusCode: 500,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t update the site.',
                })
                return
            }
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        }
        callback(null, response)    
    })
}