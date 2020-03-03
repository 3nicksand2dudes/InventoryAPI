'use strict'

const expect = require('chai').expect
const request = require('supertest')
const dynamodbHelper = require('../dynamodbHelper');

beforeAll((done) => {
  const sitesAndInventoryDataSet = [
    {
      table: 'site-table-0.6-test',
      items: [
        { siteId: { S: "TST_T1" }, address: { S: 'TestStreet 1' }, deleted: {BOOL: false}, siteName: {S: "Testcity"} }
      ]
    },
    {
      table: 'inventory-table-0.6-test',
      items: [
        { id: { S: "06429f8b-0411-426e-9d31-0e5ea66e4beb" }, amount: { N: "2" }, deleted: {BOOL: false}, modelNumber: {S: "T1"}, site: { S: "TST_T1" } }
      ]
    }
  ]
  dynamodbHelper.setData(sitesAndInventoryDataSet, done)
})
afterAll((done) => {
  dynamodbHelper.emptyTables([
    { table:'site-table-0.6-test', hashKey: ['siteId'] },
    { table:'inventory-table-0.6-test', hashKey: ['id'] }
  ], done);
})

describe('API — teamsByGame', () => {
    const server = request('http://localhost:3000')
  
    it('GET /site/{id}', (done) => {
      server.get('/site/TST_T1')
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e'})
        .expect(200)
        .end((error, result) => {
          if (error) return done(error)
          expect(result.body).to.deep.equal({ 
              siteId: 'TST_T1',
              siteName: 'Testcity',
              address: 'TestStreet 1' 
            })
            //console.log(result.body)
          return done()
        })
    })

    it('GET /site/{id} - Malformatted ID', (done) => {
      server.get('/site/XXX_X1')
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e'})
        .expect(404)
        .end((error, result) => {
          if (error) return done(error)
          expect(result.error.text).to.equal('Malformatted siteId')
          return done()
        })
    })
})
