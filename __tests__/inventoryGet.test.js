describe('Inventory Get Tests', () => {
    let wrapper;
  
    beforeAll(async () => {
        wrapper = require('lambda-wrapper').wrap({
            region: 'eu-north-1',
            lambdaFunction: 'Inventory-API-dev-getInventory'
        })
        
    })
  
    it('Inventory is returned correctly', async () => {
        const event = { pathParameters:{id: '8157843e-d04b-402a-b04b-057cb0f487ec' }}

        const response = await wrapper.run(event);

        expect(response.statusCode).toBe(200)
        expect(response.body).toBe('{"amount":99,"itemId":"8967d3d2-30de-491c-a4d0-60ba07271b77","site":"8a862971-4c82-4d0a-b2e8-d06524042eb9","deleted":false,"id":"8157843e-d04b-402a-b04b-057cb0f487ec"}')
    })

    it('No id results in error', async () => {
        const event = { pathParameters:{id: '' }}

        const response = await wrapper.run(event);

        expect(response.statusCode).toBe(400)
        expect(response.body).toBe("Couldn't fetch the inventory item.")

    })
  })