'use strict'; // Use Strict mode 

const AWS = require('aws-sdk')

const INVENTORY_TABLE = process.env.INVENTORY_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.get = (event, context, callback) => {

    // Search for items with certain modelNumber
    const params = {
      TableName:INVENTORY_TABLE,
      ProjectionExpression: "#mn, site, amount ",
      FilterExpression: "#mn = :modeln",
      ExpressionAttributeNames: {
          "#mn": "modelNumber",
      },
      ExpressionAttributeValues: {
           ":modeln": event.pathParameters.id,
      }
    }
  
    // fetch item from the inventory database
    dynamoDb.scan(params, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error)
        callback(null, {
          statusCode: error.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t fetch the inventory item.',
        })
        return
      }
      // If response is empty
      else if(result.Items.length < 1){
        callback(null, {
          statusCode: 404 ,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Malformatted modelNumber',
        })
        return
      }
      else{

        // Calculate total amount 
        let totalAmount = 0
        result.Items.forEach(e => totalAmount += e.amount)

        const resObj = {
          "modelNumber": result.Items[0].modelNumber,
          "totalAmount": totalAmount
        }

        // create a response  
        const response = {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resObj)
        }
        callback(null, response)
      }

    })
}