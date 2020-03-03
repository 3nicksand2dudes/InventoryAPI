'use strict'

const expect = require('chai').expect
const request = require('supertest')
const dynamodbHelper = require('../dynamodbHelper');
const { isUuid  } = require('uuidv4')

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

describe('API —  POST Create Inventory', () => {
    const server = request('http://localhost:3000')
  
    it('POST /inventory/add', (done) => {
      server.post('/inventory/add')
      .send({
        "modelNumber": "T2", 
        "amount": 42,
        "siteId": "TST_T1"
      })
      .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
        .expect(201)
        .end((error, result) => {
          if (error) return done(error)
          expect(result.body.amount).to.equal(42)
          expect(result.body.modelNumber).to.equal("T2")
          expect(result.body.site).to.equal("TST_T1")
          expect(result.body.deleted).to.equal(false)
          expect(isUuid(result.body.id)).to.be.true
          //console.log(result.body)
          return done()
        })
    })

    it('POST /inventory/add - amount must be a number ', (done) => {
        server.post('/inventory/add')
        .send({
          "modelNumber": "T2", 
          "amount": "22",
          "siteId": "TST_T1"
        })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('"amount" must be a number')
            //console.log(result.body)
            return done()
          })
      })

      it('POST /inventory/add - modelNumber must be a string ', (done) => {
        server.post('/inventory/add')
        .send({
          "modelNumber": true, 
          "amount": 22,
          "siteId": "TST_T1"
        })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('"modelNumber" must be a string')
            //console.log(result.body)
            return done()
          })
      })

      it('POST /inventory/add - siteId must be a string ', (done) => {
        server.post('/inventory/add')
        .send({
          "modelNumber": "T2", 
          "amount": 22,
          "siteId": true
        })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('"siteId" must be a string')
            //console.log(result.body)
            return done()
          })
      })

      it('POST /inventory/add - modelNumber missing ', (done) => {
        server.post('/inventory/add')
        .send({
          "modelNumber": "", 
          "amount": 22,
          "siteId": "TST_T1"
        })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('Couldn\'t create the inventory item.')
            //console.log(result.body)
            return done()
          })
      })

      it('POST /inventory/add - Entry Exists ', (done) => {
        server.post('/inventory/add')
        .send({
          "modelNumber": "T1", 
          "amount": 22,
          "siteId": "TST_T1"
        })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(403)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('Couldn\'t create the inventory item. Entry exists')
            //console.log(result.body)
            return done()
          })
      })

      it('POST /inventory/add - siteId missing ', (done) => {
        server.post('/inventory/add')
        .send({
          "modelNumber": "T2", 
          "amount": 22,
          "siteId": ""
        })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('Couldn\'t create the inventory item.')
            //console.log(result.body)
            return done()
          })
      })

      it('POST /inventory/add - API key missing', (done) => {
        server.post('/inventory/add')
        .send({
          "modelNumber": "T2", 
          "amount": 42,
          "siteId": "TST_T1"
        })
        .set({ 'Content-Type' : 'application/json'})
          .expect(403)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('{"message":"Forbidden"}')
            //console.log(result)
            return done()
          })
      })
})
