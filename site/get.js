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

// GET SITE BY SITEID
module.exports.get = (event, context, callback) => {

  // GET Query parameters
  const params = {
    TableName:SITE_TABLE,
    ProjectionExpression: "siteId, siteName, address",
    Key: {
      siteId: event.pathParameters.id,
    },
  }
  
  // fetch site from the site database
  dynamoDb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 500,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain' 
        },
        body: 'Couldn\'t fetch the site.',
      })
      return
    }
    // If no entry was found, the query id is probably malformatted
    if(!result.Item){
      callback(null, {
        statusCode: 404 ,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain' 
        },
        body: 'Malformatted siteId',
      })
      return
    }
    else{
      // create and send response  
      const response = {
        statusCode: 200,
        headers: { 
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result.Item),
      }
      callback(null, response)
    }    
  })
}