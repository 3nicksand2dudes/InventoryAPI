'use strict'; // Use Strict mode 

const AWS = require('aws-sdk')
let dynamoDb

// Change the dynamoDB based on if stage is test or Dev
if(process.env.Stage == "test"){
  const dynamodb = require('serverless-dynamodb-client')
  dynamoDb = dynamodb.doc; // equals AWS.DynamoDB.DocumentClient()
}
else{  
  dynamoDb = new AWS.DynamoDB.DocumentClient()  
}

// Tabel names
const SITE_TABLE  = process.env.SITE_TABLE

// POST UPDATE DELTED STATUS TO DELETED (true)
module.exports.delete = (event, context, callback) => {
    updateDeleted(event, context, callback, true)
}

// POST UPDATE DELTED STATUS TO REACTIVATED (false)
module.exports.reactivate = (event, context, callback) => {
    updateDeleted(event, context, callback, false)
}

// Function for updating deleted status
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
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain' },
                body: 'Couldn\'t update the site. Site does not exist',
                })
                return
            }else{
                console.error(error)
                callback(null, {
                statusCode: 500,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain' },
                body: 'Couldn\'t update the site.',
                })
                return
            }
        }

        const response = {
            statusCode: 200,
            headers: { 
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(result.Attributes),
        }
        callback(null, response)    
    })
}