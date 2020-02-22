# InventoryAPI
Inventory API for Cloud Native App @ Arcada 2020

**TO RUN TESTS USE: ```npm test```**

Base url, Not routed anywhere
[https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev](https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev)

## endpoints:
  **GET - https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/inventory/{ModelNumber}**

  **POST - https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/inventory**

  **GET - https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/site/{siteId}**

  **POST - https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/site/add**



### Example GET INVENTORY ITEMS BY MODELNUMBER
[https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/inventory/H7](https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/inventory/H7)

**OUTPUT**
```json
[
  {
    "amount": 45,
    "modelNumber": "H7",
    "site": "FIN_H3"
  },
  {
    "amount": 42,
    "modelNumber": "H7",
    "site": "FIN_H1"
  }
]
```

### Example POST NEW ITEM TO INVENTORY
[https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/inventory/](https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/inventory/)

```json
{
  "modelNumber": "H7", 
  "amount": 42,
  "siteId": "FIN H1"
}
```

### Example GET SITE BY ID
[https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/site/FIN_H1](https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/site/FIN_H1)

### Example POST NEW SITE

[https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/site/add](https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/site/add)

```json
{
  "siteId": "FIN_H1",
  "address": "StreetName 42",
  "siteName": "Helsinki"
}
```