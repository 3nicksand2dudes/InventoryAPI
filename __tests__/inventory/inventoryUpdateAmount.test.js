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
        { id: { S: "06429f8b-0411-426e-9d31-0e5ea66e4beb" }, amount: { N: "20" }, deleted: {BOOL: false}, modelNumber: {S: "T1"}, site: { S: "TST_T1" } }
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

describe('API — UPDATE Inventory Amount', () => {
    const server = request('http://localhost:3000')
  
    it('POST /inventory/amount - Addition', (done) => {
      server.post('/inventory/amount')
      .send({
        "modelNumber": "T1",
        "site": "TST_T1",
        "type": "+",
        "amount": 12
      })
      .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
        .expect(200)
        .end((error, result) => {
          if (error) return done(error)
          expect(result.body).to.deep.equal({ amount: 32, deleted: false, modelNumber: 'T1', site: 'TST_T1' })
          //console.log(result.body)
          return done()
        })
    })

    it('POST /inventory/amount - Subtraction', (done) => {
        server.post('/inventory/amount')
        .send({
          "modelNumber": "T1",
          "site": "TST_T1",
          "type": "-",
          "amount": 12
        })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(200)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.body).to.deep.equal({ amount: 20, deleted: false, modelNumber: 'T1', site: 'TST_T1' })
            //console.log(result.body)
            return done()
          })
      })

    it('POST /inventory/amount - API key missing', (done) => {
        server.post('/inventory/amount')
        .send({
            "modelNumber": "T1",
            "site": "TST_T1",
            "type": "+",
            "amount": 12
        })
        .set({ 'Content-Type' : 'application/json'})
          .expect(403)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('{"message":"Forbidden"}')
            //console.log(result.body)
            return done()
          })
    })

      it('POST /inventory/amount - modelNumber missing', (done) => {
        server.post('/inventory/amount')
        .send({
            "modelNumber": "",
            "site": "TST_T1",
            "type": "+",
            "amount": 12
          })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(500)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal("Couldn't update the inventory item.")
            //console.log(result)
            return done()
          })
    })

    it('POST /inventory/amount - Site missing', (done) => {
        server.post('/inventory/amount')
        .send({
            "modelNumber": "T1",
            "site": "",
            "type": "+",
            "amount": 12
          })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(500)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal("Couldn't update the inventory item.")
            //console.log(result)
            return done()
          })
    })

    it('POST /inventory/amount - amount must be a number', (done) => {
        server.post('/inventory/amount')
        .send({
            "modelNumber": "T1",
            "site": "",
            "type": "+",
            "amount": "12"
          })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('"amount" must be a number')
            //console.log(result)
            return done()
          })
    })

    it('POST /inventory/amount - type must be either + or -', (done) => {
        server.post('/inventory/amount')
        .send({
            "modelNumber": "T1",
            "site": "TST_T1",
            "type": "*",
            "amount": 12
          })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('"type" must be "-" or "+" to indicate decrease or increase.')
            //console.log(result)
            return done()
          })
    })

    it('POST /inventory/amount - entry does not exist', (done) => {
        server.post('/inventory/amount')
        .send({
            "modelNumber": "T1",
            "site": "TST_T2",
            "type": "+",
            "amount": 12
          })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('Couldn\'t update the inventory item. No entry with that modelNumber and site exist')
            //console.log(result)
            return done()
          })
    })
})
