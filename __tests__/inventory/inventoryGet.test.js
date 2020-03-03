'use strict'

const expect = require('chai').expect
const request = require('supertest')
const dynamodbHelper = require('../dynamodbHelper');

beforeAll((done) => {
  const sitesAndInventoryDataSet = [
    {
      table: 'site-table-0.6-test',
      items: [
        { siteId: { S: "TST_T1" }, address: { S: 'TestStreet 1' }, deleted: {BOOL: false}, siteName: {S: "Testcity"} },
        { siteId: { S: "TST_T2" }, address: { S: 'TestStreet 2' }, deleted: {BOOL: false}, siteName: {S: "Testcity"} }
      ]
    },
    {
      table: 'inventory-table-0.6-test',
      items: [
        { id: { S: "06429f8b-0411-426e-9d31-0e5ea66e4beb" }, amount: { N: "2" }, deleted: {BOOL: false}, modelNumber: {S: "T1"}, site: { S: "TST_T1" } },
        { id: { S: "06429f8b-0411-426e-9d31-0e5ea66e4bec" }, amount: { N: "20" }, deleted: {BOOL: false}, modelNumber: {S: "T2"}, site: { S: "TST_T1" } },
        { id: { S: "06429f8b-0411-426e-9d31-0e5ea66e4bed" }, amount: { N: "20" }, deleted: {BOOL: false}, modelNumber: {S: "T1"}, site: { S: "TST_T2" } },
        { id: { S: "06429f8b-0411-426e-9d31-0e5ea66e4bee" }, amount: { N: "0" }, deleted: {BOOL: false}, modelNumber: {S: "T2"}, site: { S: "TST_T2" } },
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

describe('API — GET Inventory', () => {
    const server = request('http://localhost:3000')
  
    it('GET /inventory/{id}', (done) => {
      server.get('/inventory/T1')
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e'})
        .expect(200)
        .end((error, result) => {
          if (error) return done(error)
          expect(result.body).to.deep.equal({ modelNumber: 'T1', totalAmount: 22 })
          //console.log(result)
          return done()
        })
    })

    it('GET /inventory/{id} - Malformatted modelNumber', (done) => {
        server.get('/inventory/T3')
          .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e'})
          .expect(404)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('Malformatted modelNumber')
            //console.log(result)
            return done()
          })
      })

      it('GET /inventory/{id} - No id', (done) => {
        server.get('/inventory/')
          .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e'})
          .expect(404)
          .end((error, result) => {
            if (error) return done(error)
            //console.log(result)
            return done()
          })
      })

      it('GET /inventory/{id} - API key missing', (done) => {
        server.get('/inventory/T1')
          .expect(403)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('{"message":"Forbidden"}')
            //console.log(result)
            return done()
          })
      })
})
