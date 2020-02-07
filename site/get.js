'use strict'; // Use Strict mode 

const AWS = require('aws-sdk')

const SITE_TABLE  = process.env.SITE_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient()


module.exports.get = (event, context, callback) => {
    const params = {
      TableName:SITE_TABLE,
      Key: {
        id: event.pathParameters.id,
      },
    }
  
    // TODO MORE SPEFICIF ERROR HANDLING, SUCH AS isuuid()
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
  
      //TODO CHANGE RESPONSE TO NOT SEND EVERYTHING ???
      // create a response  
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      }
      callback(null, response)
    })
}