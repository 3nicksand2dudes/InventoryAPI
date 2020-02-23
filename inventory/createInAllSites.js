'use strict'; // Use Strict mode 

const AWS = require('aws-sdk')
const { uuid, isUuid  } = require('uuidv4')

const INVENTORY_TABLE = process.env.INVENTORY_TABLE
const SITE_TABLE  = process.env.SITE_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.createInAllSites = (event, context, callback) => {

    const data = JSON.parse(event.body)


    // Check if modelNumber is an String
    if (typeof data.modelNumber !== 'string') {
        console.error('Validation Failed')
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: '"modelNumber" must be a string',
        })
        return
    }

    const querySiteParams = {
        TableName: SITE_TABLE,
        ProjectionExpression: "siteId",
    }

    // Get all sites
    dynamoDb.scan(querySiteParams, (err, result) => {


        if (err) {
            console.error(err)
            callback(null, {
              statusCode: err.statusCode || 501,
              headers: { 'Content-Type': 'text/plain' },
              body: 'Couldn\'t create the inventory item.',
            })
            return

        // No sites exist
        }else if(result.Items.length < 1){
            console.error("Here2")
            callback(null, {
              statusCode: err.statusCode || 501,
              headers: { 'Content-Type': 'text/plain' },
              body: 'Couldn\'t create the inventory item. No sites exists',
            })
            return

        }else {

            let failedItems = []

            // TODO Dont allow duplicates

            // Add item to each site with inventory 0 
            result.Items.forEach(element => {

                let params = {
                    TableName: INVENTORY_TABLE,
                    Item: {
                      id: uuid(),
                      modelNumber: data.modelNumber,
                      amount: 0,
                      site: element.siteId,
                      deleted: false,
                    },
                    ConditionExpression: 'attribute_not_exists(siteId)'
                }
            
                dynamoDb.put(params, (error) => {
                    // If it fails, extend array of failed
                    if (error) {
                      console.error(error)
                      failedItems.push(params)
                    }

                })
                
                // If any has failed, report it back
                if(failedItems.length > 0){
                     const response = {
                         statusCode: 501,
                         headers: { 'Content-Type': 'text/plain' },
                         body: 'Couldn\'t create item created to every site' ,
                     }
                 callback(null, response)

                }
                // if all succeded
                else{
                     const response = {
                         statusCode: 201,
                         headers: { 'Content-Type': 'text/plain' },
                         body: 'Item created to every site',
                     }
                 callback(null, response)
                }

                
            })


        }

    })
  
    
}