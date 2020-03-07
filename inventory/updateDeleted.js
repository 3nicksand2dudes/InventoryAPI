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
const INVENTORY_TABLE = process.env.INVENTORY_TABLE

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
              headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain' },
              body: 'Couldn\'t update the inventory item.',
            })
            return

        // No sites exist
        }else if(res.Items.length < 1){
            callback(null, {
              statusCode: 400,
              headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain' },
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
                        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/plain' },
                        body: 'Couldn\'t update the inventory.',
                    })
                    return
                }

                const responseBody = {
                    "amount": result.Attributes.amount,
                    "deleted": result.Attributes.deleted,
                    "modelNumber": result.Attributes.modelNumber,
                    "site": result.Attributes.site,
                }
        
                const response = {
                    statusCode: 200,
                    headers: { 
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(responseBody),
                }
                callback(null, response)    
            })


        }

    })

}