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

describe('API — UPDATE Inventory Delted Status', () => {
    const server = request('http://localhost:3000')
  
    it('POST /inventory/delete', (done) => {
      server.post('/inventory/delete')
      .send({
        "modelNumber": "T1",
        "site": "TST_T1"
      })
      .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
        .expect(200)
        .end((error, result) => {
          if (error) return done(error)
          expect(result.body).to.deep.equal({ amount: 2, deleted: true, modelNumber: 'T1', site: 'TST_T1' })
          //console.log(result.body)
          return done()
        })
    })

    it('POST /inventory/delete - API key missing', (done) => {
        server.post('/inventory/delete')
        .send({
          "modelNumber": "T1",
          "site": "TST_T1"
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

      it('POST /inventory/delete - modelNumber missing', (done) => {
        server.post('/inventory/delete')
        .send({
          "modelNumber": "",
          "site": "TST_T1"
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

    it('POST /inventory/delete - site missing', (done) => {
        server.post('/inventory/delete')
        .send({
          "modelNumber": "T1",
          "site": ""
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

    it('POST /inventory/delete - site missing', (done) => {
        server.post('/inventory/delete')
        .send({
          "modelNumber": "T1",
          "site": "TST_T2"
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


    it('POST /inventory/reactivate', (done) => {
        server.post('/inventory/reactivate')
        .send({
          "modelNumber": "T1",
          "site": "TST_T1"
        })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(200)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.body).to.deep.equal({ amount: 2, deleted: false, modelNumber: 'T1', site: 'TST_T1' })
            //console.log(result.body)
            return done()
          })
      })
  
      it('POST /inventory/reactivate - API key missing', (done) => {
          server.post('/inventory/reactivate')
          .send({
            "modelNumber": "T1",
            "site": "TST_T1"
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
  
        it('POST /inventory/reactivate - modelNumber missing', (done) => {
          server.post('/inventory/reactivate')
          .send({
            "modelNumber": "",
            "site": "TST_T1"
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
  
      it('POST /inventory/reactivate - site missing', (done) => {
          server.post('/inventory/reactivate')
          .send({
            "modelNumber": "T1",
            "site": ""
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
  
      it('POST /inventory/reactivate - site missing', (done) => {
          server.post('/inventory/reactivate')
          .send({
            "modelNumber": "T1",
            "site": "TST_T2"
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
