# InventoryAPI
Inventory API for Cloud Native App @ Arcada 2020

**TO RUN TESTS USE:** 


```
serverless dynamodb start --migrate --stage test --sharedDb
serverless offline --stage test
npm test
```

Base url, Not routed anywhere
[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev)

## endpoints:
*  **GET - https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/{ModelNumber}**

* **POST - https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/add**

*  **POST - https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/create**

*  **GET - https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/site/{siteId}**

*  **POST - https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/site/add**

*  **POST -  https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/site/delete/{siteId}**

*  **POST - https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/site/reactivate/{siteId}**

*  **POST - https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/delete**

*  **POST - https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/reactivate**

*  **POST - https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/amount**




### Example GET INVENTORY ITEMS BY MODELNUMBER
[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/H7](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/H7)

**OUTPUT**
```json
  {
    "modelNumber": "H7",
    "totalAmount": 174
  }
```

### Example POST NEW ITEM TO INVENTORY
[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/add](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/add)

**INPUT**
```json
{
  "modelNumber": "H7", 
  "amount": 42,
  "siteId": "FIN_H1"
}
```

**OUTPUT**
```json
{
  "id": "690c8fbb-2aae-4b1d-bcb7-9e413015467b",
  "modelNumber": "H23",
  "amount": 42,
  "site": "FIN H1",
  "deleted": false
}
```

### Example POST NEW ITEM TO INVENTORY TO EVERY SITE
[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/create](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/create)

**INPUT**
```json
{
  "modelNumber": "H7"
}
```

### Example GET SITE BY ID
[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/site/FIN_H1](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/site/FIN_H1)

**OUTPUT**
```json
{
  "siteId": "FIN_H1",
  "address": "StreetName 42",
  "siteName": "Helsinki"
}
```


### Example POST NEW SITE

[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/site/add](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/site/add)

**INPUT**
```json
{
  "siteId": "DNK_C1",
  "address": "StreetName 42",
  "siteName": "Copenhagen"
}
```

**OUTPUT**
```json
{
  "siteId": "DNK_C1",
  "siteName": "Copenhagen",
  "address": "StreetName 42",
  "deleted": false
}
```

### Example POST DELETE SITE
[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/site/delete/FIN_H1](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/site/delete/FIN_H1)

**OUTPUT**
```json
{
  "siteId": "FIN_H1",
  "address": "StreetName 42",
  "deleted": true,
  "siteName": "Helsinki"
}
```

### Example POST REACTIVATE SITE
[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/site/reactivate/FIN_H1](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/site/reactivate/FIN_H1)

**OUTPUT**
```json
{
  "siteId": "FIN_H1",
  "address": "StreetName 42",
  "deleted": false,
  "siteName": "Helsinki"
}
```

### Example POST DELETE INVENTORY
[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/delete](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/delete)

**INPUT**
```json
{
  "modelNumber": "H2",
  "site": "FIN_H1"
}
```

**OUTPUT**
```json
{
  "amount": 86,
  "deleted": true,
  "modelNumber": "H2",
  "site": "FIN_H1",
  "id": "776333a1-8845-453c-bd18-99758e323fd5"
}
```

### Example POST REACTIVATE INVENTORY
[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/reactivate](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/reactivate)

**INPUT**
```json
{
  "modelNumber": "H2",
  "site": "FIN_H1"
}
```

**OUTPUT**
```json
{
  "amount": 86,
  "deleted": false,
  "modelNumber": "H2",
  "site": "FIN_H1",
  "id": "776333a1-8845-453c-bd18-99758e323fd5"
}
```

### Example POST UPDATE INVENTORY AMOUNT
[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/amount](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/amount)

**INPUT**
```json
{
  "modelNumber": "H2",
  "site": "FIN_H1",
  "type": "+",
  "amount": 22
}
```

**OUTPUT**
```json
{
  "amount": 108,
  "deleted": false,
  "modelNumber": "H2",
  "site": "FIN_H1",
  "id": "776333a1-8845-453c-bd18-99758e323fd5"
}

```