const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const sites = require('./sites.js');
const inventory = require('./inventory.js');




app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
    res.send('Hello World!')
})

// Get item endpoint
app.get('/items/:itemId', inventory.getItem);

// Create item endpoint
app.post('/items', inventory.createItem);

//Update item endpoint TODO

//(get items per site) TODO


// Get warehouse endpoint
app.get('/warehouses/:warehouseId', sites.getSites)

//(update warehouse endpoint) TODO

// Create warehouse endpoint
app.post('/warehouses', sites.createSite)

module.exports.handler = serverless(app);