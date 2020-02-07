describe('Site Get Tests', () => {
    let wrapper;
  
    beforeAll(async () => {
        wrapper = require('lambda-wrapper').wrap({
            region: 'eu-north-1',
            lambdaFunction: 'Inventory-API-dev-getSite'
        })
        
    })
  
    it('Site is returned correctly', async () => {
        const event = { pathParameters:{id: 'a5428f4e-a5d1-422e-96b2-9b4c439e7130' }}

        const response = await wrapper.run(event);

        expect(response.statusCode).toBe(200)
        expect(response.body).toBe('{"siteName":"Helsinki","address":"Randomkuja 51","deleted":false,"id":"a5428f4e-a5d1-422e-96b2-9b4c439e7130"}')
    })

    it('No id results in error', async () => {
        const event = { pathParameters:{id: '' }}

        const response = await wrapper.run(event);

        expect(response.statusCode).toBe(400)
        expect(response.body).toBe("Couldn't fetch the site.")

    })
  })