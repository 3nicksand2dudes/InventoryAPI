'use strict'; // Use Strict mode 

const AWS = require('aws-sdk')
const { uuid, isUuid  } = require('uuidv4')

const INVENTORY_TABLE = process.env.INVENTORY_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.create = (event, context, callback) => {
    
    const data = JSON.parse(event.body)
    
    // TODO CHECK IF ENTRY EXISTS, IF ITEM AND SITE EXSISTS IN SAME DOCUMENT
    // VALIDATION FOR DATA INPUT
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
  
    // write the item to the inventory database
    dynamoDb.put(params, (error) => {
      // handle potential errors
      if (error) {
        console.error(error)
        callback(null, {
          statusCode: error.statusCode || 501,
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