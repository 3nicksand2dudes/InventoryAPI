const AWS = require('aws-sdk');

const WAREHOUSE_TABLE = process.env.WAREHOUSE_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();


// Get warehouse endpoint
const getSites = (req, res) => {
    const params = {
        TableName: WAREHOUSE_TABLE,
        Key: {
            warehouseId: req.params.warehouseId,
        },
    }

    dynamoDb.get(params, (error, result) => {
         if (error) {
             console.log(error);
             res.status(400).json({ error: 'Could not get warehouse' });
         }
         if (result.Item) {
             const { warehouseId, name, adress } = result.Item;
             res.json({ warehouseId, name, adress });
         } else {
            res.status(404).json({ error: "Warehouse not found" });
         }
    });
};

// Create warehouse endpoint
const createSite = (req, res) => {
    const { warehouseId, name, adress } = req.body;
    if (typeof warehouseId !== 'string') {
        res.status(400).json({ error: '"warehouseId" must be a string' });
    } else if (typeof name !== 'string') {
        res.status(400).json({ error: '"name" must be a string' });
    } else if (typeof adress !== 'string') {
        res.status(400).json({ error: '"adress" must be a string' });
    }

    const params = {
        TableName: WAREHOUSE_TABLE,
        Item: {
            warehouseId: warehouseId,
            name: name,
            adress: adress,
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not create warehouse' });
        }
        res.json({ warehouseId, name, adress });
    });
};

//Update site endpoint TODO
const updateSite = (req, res) => {
    const params = {
        TableName: WAREHOUSE_TABLE,
        Key: {
            warehouseId: req.params.warehouseId,
        },
        ExpressionAttributeValues: {
            name: name,
            adress: adress,
        },
        UpdateExpression: 'SET name=:name, adress=:adress',
        ReturnValues: ALL_NEW,
    };

    dynamoDb.update(params, (error) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'could not update site' });
        }
        res.json({ warehouseId, name, adress });
    });
}

module.exports = {
    getSites,
    createSite,
    updateSite
}