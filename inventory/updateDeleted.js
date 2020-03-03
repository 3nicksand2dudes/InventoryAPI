'use strict'; // Use Strict mode 

const AWS = require('aws-sdk')

const INVENTORY_TABLE  = process.env.INVENTORY_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient()


module.exports.delete = (event, context, callback) => {
    updateDeleted(event, context, callback, true)
}

module.exports.reactivate = (event, context, callback) => {
    updateDeleted(event, context, callback, false)
}


function updateDeleted(event, context, callback, deletedStatus){

    const data = JSON.parse(event.body)

    const scanParams = {
        TableName: INVENTORY_TABLE,
        FilterExpression: "#mn = :modeln and #site = :site",
        ExpressionAttributeNames: {
            "#mn": "modelNumber",
            "#site": "site"
        },
        ExpressionAttributeValues: {
             ":modeln": data.modelNumber,
             ":site": data.site
        }
      }

    dynamoDb.scan(scanParams, (err, res) => {

        if (err) {
            console.error(err)
            callback(null, {
              statusCode: 500,
              headers: { 'Content-Type': 'text/plain' },
              body: 'Couldn\'t update the inventory item.',
            })
            return

        // No sites exist
        }else if(res.Items.length < 1){
            callback(null, {
              statusCode: 400,
              headers: { 'Content-Type': 'text/plain' },
              body: 'Couldn\'t update the inventory item. No entry with that modelNumber and site exist',
            })
            return

        }else {

            const params = {
                TableName:INVENTORY_TABLE,
                Key: {
                    id: res.Items[0].id
                },
                ExpressionAttributeNames:{
                    '#deleted': 'deleted',
                },
                ExpressionAttributeValues:{
                    ':deleted': deletedStatus
                },
                UpdateExpression: 'SET #deleted=:deleted',
                ReturnValues: "ALL_NEW"
            }
        
            dynamoDb.update(params, (error, result) => {
        
                if (error) {
                    console.error(error)
                    callback(null, {
                        statusCode: error.statusCode || 500,
                        headers: { 'Content-Type': 'text/plain' },
                        body: 'Couldn\'t update the inventory.',
                    })
                    return
                }
        
                const response = {
                    statusCode: 200,
                    body: JSON.stringify(result.Attributes),
                }
                callback(null, response)    
            })


        }

    })

}