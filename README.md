# InventoryAPI
Inventory API for Cloud Native App @ Arcada 2020

**TO RUN TESTS USE: ```npm test```**

Base url, Not routed anywhere
[https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev](https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev)

## endpoints:
  **GET - https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/inventory/{id}**

  **POST - https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/inventory**

  **GET - https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/site/{id}**

  **POST - https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/site**



### Example GET INVENTORY ITEM BY ID
[https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/inventory/8157843e-d04b-402a-b04b-057cb0f487ec](https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/inventory/8157843e-d04b-402a-b04b-057cb0f487ec)

### Example POST NEW ITEM TO INVENTORY
[https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/inventory/](https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/inventory/)

```json
{
  "itemId": "20043d4d-a807-49db-a571-7e1d4ad8f49f", 
  "amount": 42,
  "site": "5a191cab-d05c-489c-bf57-c40bda8b3c8c"
}
```

### Example GET SITE BY ID
[https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/site/a5428f4e-a5d1-422e-96b2-9b4c439e7130](https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/site/a5428f4e-a5d1-422e-96b2-9b4c439e7130)

### Example POST NEW SITE

[https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/site/](https://ykold98ku7.execute-api.eu-north-1.amazonaws.com/dev/site/)

```json
{
  "siteName": "Helsinki", 
  "address": "StreetName 42"
}
```