'use strict'; // Use Strict mode 

const AWS = require('aws-sdk')

const SITE_TABLE  = process.env.SITE_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient()


module.exports.get = (event, context, callback) => {
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
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t fetch the site.',
        })
        return
      }
      if(!result.Item){
        callback(null, {
          statusCode: 404 ,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Malformatted siteId',
        })
        return
      }
      else{
        // create a response  
        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Item),
        }
        callback(null, response)
      }
      
    })
}