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

describe('API — UPDATE Site Deleted status', () => {
    const server = request('http://localhost:3000')
  
    it('POST /site/delete/{id}', (done) => {
      server.post('/site/delete/TST_T1')
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e'})
        .expect(200)
        .end((error, result) => {
          if (error) return done(error)
          expect(result.body).to.deep.equal({ 
              siteId: 'TST_T1',
              siteName: 'Testcity',
              address: 'TestStreet 1',
              deleted: true 
            })
            //console.log(result.body)
          return done()
        })
    })

    it('POST /site/delete/{id} - no id', (done) => {
        server.post('/site/delete/')
          .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e'})
          .expect(404)
          .end((error, result) => {
            if (error) return done(error)
              //console.log(result.body)
            return done()
          })
    })

      it('POST /site/delete/{id} - No Matching id found', (done) => {
        server.post('/site/delete/TST_T2')
          .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal("Couldn't update the site. Site does not exist")
            //console.log(result)
            return done()
          })
    })

    it('POST /site/reactivate/{id}', (done) => {
      server.post('/site/reactivate/TST_T1')
        .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e'})
        .expect(200)
        .end((error, result) => {
          if (error) return done(error)
          expect(result.body).to.deep.equal({ 
            siteId: 'TST_T1',
            siteName: 'Testcity',
            address: 'TestStreet 1',
            deleted: false 
          })
          //console.log(result.body)
          return done()
        })
    })

    it('POST /site/reactivate/{id} - No id', (done) => {
        server.post('/site/reactivate/')
          .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e'})
          .expect(404)
          .end((error, result) => {
            if (error) return done(error)
            //console.log(result)
            return done()
          })
    })

    
    it('POST /site/reactivate/{id} - No Matching id found', (done) => {
        server.post('/site/reactivate/TST_T2')
          .set({ 'x-api-Key': 'd41d8cd98f00b204e9800998ecf8427e'})
          .expect(400)
          .end((error, result) => {
            if (error) return done(error)
            expect(result.error.text).to.equal("Couldn't update the site. Site does not exist")
            //console.log(result)
            return done()
          })
    })
})
