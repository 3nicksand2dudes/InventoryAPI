'use strict'; // Use Strict mode 

const AWS = require('aws-sdk')
const { uuid } = require('uuidv4')
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
const INVENTORY_TABLE = process.env.INVENTORY_TABLE

module.exports.create = (event, context, callback) => {
    
    const data = JSON.parse(event.body)
  
    // Check if amount is a number
    if (typeof data.amount !== 'number') {
      console.error('Validation Failed')
      callback(null, {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: '"amount" must be a number',
      })
      return
    }
    // Check if modelNumber is an String
    else if (typeof data.modelNumber !== 'string') {
      console.error('Validation Failed')
      callback(null, {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: '"modelNumber" must be a string',
      })
      return
    }

    // TODO Check if modelNumber exists

    // Check if site is an valid uuid
    else if (typeof data.siteId !== 'string') {
      console.error('Validation Failed')
      callback(null, {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: '"siteId" must be a string',
      })
      return
    }

    const params = {
      TableName: INVENTORY_TABLE,
      Item: {
        id: uuid(),
        modelNumber: data.modelNumber,
        amount: data.amount,
        site: data.siteId,
        deleted: false,
      },
    }

    const paramsToCheck = {
      TableName: INVENTORY_TABLE,
      ProjectionExpression: "#mn, amount, site",
      FilterExpression: "#mn = :modeln and #site = :site",
      ExpressionAttributeNames: {
          "#mn": "modelNumber",
          "#site": "site"
      },
      ExpressionAttributeValues: {
           ":modeln": data.modelNumber,
           ":site": data.siteId
      }
    }

    // Check if entry exists
    dynamoDb.scan(paramsToCheck, (err, res) => {
      // handle potential errors
      if (err) {
        console.error(err)
        callback(null, {
          statusCode: err.statusCode || 500,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t create the inventory item.',
        })
        return
      }
      else if(res.Items.length > 0){
        console.error(err)
        callback(null, {
          statusCode: 403,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t create the inventory item. Entry exists',
        })
        return
      }
      else {
        // write the item to the inventory database
        dynamoDb.put(params, (error) => {
          // handle potential errors
          if (error) {
            console.error(error)
            callback(null, {
              statusCode: error.statusCode || 500,
              headers: { 'Content-Type': 'text/plain' },
              body: 'Couldn\'t create the inventory item.',
            })
            return
          }
      
          // create a response
          const response = {
            statusCode: 201,
            body: JSON.stringify(params.Item),
          }
          callback(null, response)
        })

      }

    })
  
    
}