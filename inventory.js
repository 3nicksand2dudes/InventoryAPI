const AWS = require('aws-sdk');

const INVENTORY_TABLE = process.env.INVENTORY_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Get item endpoint
const getItem = (req, res) =>{
    const params = {
        TableName: INVENTORY_TABLE,
        Key: {
            itemId: req.params.itemId,
        },
    }

    dynamoDb.get(params, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not get item' });
        }
        if (result.Item) {
            const { itemId, amount, site } = result.Item;
            res.json({ itemId, amount, site });
        } else {
            res.status(404).json({ error: "Item not found" });
        }
    });
}

// Create item endpoint
const createItem = (req, res) => {
    const { itemId, amount, site } = req.body;
    if (typeof itemId !== 'string') {
        res.status(400).json({ error: '"itemId" must be a string' });
    } else if (typeof amount !== 'number') {
        res.status(400).json({ error: '"amount" must be a number' });
    } else if (typeof amount !== 'number') {
        res.status(400).json({ error: '"site" must be a number' });//should site be identified by number or string(like prodID)?
    }

    const params = {
        TableName: INVENTORY_TABLE,
        Item: {
            itemId: itemId,
            amount: amount,
            site: site,
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not create item' });
        }
        res.json({ itemId, amount, site });
    });
}

//Update item endpoint TODO
const updateItem = (req, res) => {
    const params = {
        TableName: INVENTORY_TABLE,
        Key: {
            itemId: req.params.itemId,
        },
        ExpressionAttributeValues: {
            amount: amount
        },
        UpdateExpression: 'SET amount=:amount',
        ReturnValues: ALL_NEW,
    };

    dynamoDb.update(params, (error) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'could not update item' });
        }
        res.json({ itemId, amount });
    });
}

module.exports = {
    getItem,
    createItem,
    updateItem
}