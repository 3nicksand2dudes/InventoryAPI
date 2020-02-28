'use strict'; // Use Strict mode 

const AWS = require('aws-sdk')

const SITE_TABLE  = process.env.SITE_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.create = (event, context, callback) => {
    
    const data = JSON.parse(event.body)

    // Check if siteName is a string
    if (typeof data.siteName !== 'string') {
        console.error('Validation Failed')
        callback(null, {
          statusCode: 400,
          headers: { 'Content-Type': 'text/plain' },
          body: '"siteName" must be a string',
        })
        return
    }
    // Check if adddress is a string
    if (typeof data.address !== 'string') {
        console.error('Validation Failed')
        callback(null, {
          statusCode: 400,
          headers: { 'Content-Type': 'text/plain' },
          body: '"address" must be a string',
        })
        return
    }

    // Check if siteId is a string
    if (typeof data.siteId !== 'string') {
      console.error('Validation Failed')
      callback(null, {
          statusCode: 400,
          headers: { 'Content-Type': 'text/plain' },
          body: '"id" must be a string',
      })
      return
    }

    const params = {
      TableName: SITE_TABLE,
      Item: {
        siteId: data.siteId,
        siteName: data.siteName,
        address: data.address,
        deleted: false,
      },
      ConditionExpression: 'attribute_not_exists(siteId)'
    }
  
    // write the site to the site database
    dynamoDb.put(params, (error) => {
      // handle potential errors
      if (error) {
        if(error.message == 'The conditional request failed'){
          console.error(error)
          callback(null, {
            statusCode: error.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create the site. SiteId already exsits',
          })
          return
        }
        else{
          console.error(error)
          callback(null, {
            statusCode: error.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create the site.',
          })
          return
        }
      }
  
      // create a response
      const response = {
        statusCode: 201,
        body: JSON.stringify(params.Item),
      }
      callback(null, response)
    })
}