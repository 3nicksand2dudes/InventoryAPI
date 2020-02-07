'use strict'; // Use Strict mode 

const AWS = require('aws-sdk')

const INVENTORY_TABLE = process.env.INVENTORY_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient()


module.exports.get = (event, context, callback) => {
    const params = {
      TableName:INVENTORY_TABLE,
      Key: {
        id: event.pathParameters.id,
      },
    }
  
    // TODO MORE SPEFICIF ERROR HANDLING, SUCH AS isuuid()
    // fetch item from the inventory database
    dynamoDb.get(params, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error)
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t fetch the inventory item.',
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