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

describe('API — POST Create New Site', () => {
    const server = request('http://localhost:3000')
  
    it('POST /site/add', (done) => {
      server.post('/site/add')
        .send({
            "siteId": "TST_T2",
            "address": "TestStreet 1",
            "siteName": "Cityname"
          })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
        .expect(201)
        .end((error, result) => {
          if (error) return done(error)
           expect(result.body).to.deep.equal({
            "siteId": "TST_T2",
            "address": "TestStreet 1",
            "siteName": "Cityname",
            "deleted":false
          })
          //console.log(result)
          return done()
        })
    })

    it('POST /site/add - siteId missing', (done) => {
      server.post('/site/add')
        .send({
            "siteId": "",
            "address": "TestStreet 1",
            "siteName": "Cityname"
        })
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
        .expect(400)
        .end((error, result) => {
          if (error) return done(error)
          expect(result.error.text).to.equal("Couldn't create the site.")
          //console.log(result)
          return done()
        })
    })

    it('POST /site/add - address missing', (done) => {
        server.post('/site/add')
          .send({
              "siteId": "TST_T2",
              "address": "",
              "siteName": "Cityname"
          })
          .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal("Couldn't create the site.")
            //console.log(result)
            return done()
          })
    })

    it('POST /site/add - siteName missing', (done) => {
        server.post('/site/add')
          .send({
              "siteId": "TST_T2",
              "address": "TestStreet 1",
              "siteName": ""
          })
          .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal("Couldn't create the site.")
            //console.log(result)
            return done()
          })
    })

    it('POST /site/add - siteId is not a string', (done) => {
        server.post('/site/add')
          .send({
              "siteId": true,
              "address": "TestStreet 1",
              "siteName": "Cityname"
          })
          .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('"id" must be a string')
            //console.log(result)
            return done()
          })
    })

    it('POST /site/add - address is not a string', (done) => {
        server.post('/site/add')
          .send({
              "siteId": "TST_T2",
              "address": true,
              "siteName": "Cityname"
          })
          .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('"address" must be a string')
            //console.log(result)
            return done()
          })
    })

    it('POST /site/add - siteName is not a string', (done) => {
        server.post('/site/add')
          .send({
              "siteId": "TST_T2",
              "address": "TestStreet 1",
              "siteName": true
          })
          .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('"siteName" must be a string')
            //console.log(result)
            return done()
          })
    })

    it('POST /site/add - siteId already exists', (done) => {
        server.post('/site/add')
          .send({
              "siteId": "TST_T1",
              "address": "TestStreet 1",
              "siteName": "Cityname"
          })
          .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e', 'Content-Type' : 'application/json'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal('Couldn\'t create the site. SiteId already exsits')
            //console.log(result)
            return done()
          })
    })

    it('POST /site/add', (done) => {
        server.post('/site/add')
          .send({
              "siteId": "TST_T2",
              "address": "TestStreet 1",
              "siteName": "Cityname"
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
