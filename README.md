# InventoryAPI
Inventory API for Cloud Native App @ Arcada 2020

**TO RUN TESTS USE: ```npm test```**

Base url, Not routed anywhere
[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev)

## endpoints:
  **GET - https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/{ModelNumber}**

  **POST - https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/add**

  **POST - https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/create**

  **GET - https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/site/{siteId}**

  **POST - https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/site/add**



### Example GET INVENTORY ITEMS BY MODELNUMBER
[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/H7](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/H7)

**OUTPUT**
```json
  {
    "modelNumber": "H7",
    "totalAmount": 174
  }
```

### Example POST NEW ITEM TO INVENTORY TO EVERY SITE
[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/create](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/create)

```json
{
  "modelNumber": "H7"
}
```

### Example POST NEW ITEM TO INVENTORY
[https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/add](https://gljjr6hwrd.execute-api.eu-north-1.amazonaws.com/dev/inventory/add)

```json
{
  "modelNumber": "H7", 
  "amount": 42,
  "siteId": "FIN H1"
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

```json
{
  "siteId": "FIN_H1",
  "address": "StreetName 42",
  "siteName": "Helsinki"
}
```