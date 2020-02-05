const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');


const INVENTORY_TABLE = process.env.INVENTORY_TABLE;
const WAREHOUSE_TABLE = process.env.WAREHOUSE_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

// Get item endpoint
app.get('/items/:itemId', function (req, res) {
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
      const {itemId, amount} = result.Item;
      res.json({ itemId, amount });
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  });
})

// Create item endpoint
app.post('/items', function (req, res) {
  const { itemId, amount } = req.body;
  if (typeof itemId !== 'string') {
    res.status(400).json({ error: '"itemId" must be a string' });
  } else if (typeof amount !== 'number') {
    res.status(400).json({ error: '"amount" must be a number' });
  }

  const params = {
    TableName: INVENTORY_TABLE,
    Item: {
      itemId: itemId,
      amount: amount,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create item' });
    }
    res.json({ itemId, amount });
  });
})





// Get warehouse endpoint
app.get('/warehouses/:warehouseId', function (req, res) {
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
      const {warehouseId, name} = result.Item;
      res.json({ warehouseId, name });
    } else {
      res.status(404).json({ error: "Warehouse not found" });
    }
  });
})

// Create warehouse endpoint
app.post('/warehouses', function (req, res) {
  const { warehouseId, name } = req.body;
  if (typeof warehouseId !== 'string') {
    res.status(400).json({ error: '"warehouseId" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: WAREHOUSE_TABLE,
    Item: {
      warehouseId: warehouseId,
      name: name,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create warehouse' });
    }
    res.json({ warehouseId, name });
  });
})

module.exports.handler = serverless(app);