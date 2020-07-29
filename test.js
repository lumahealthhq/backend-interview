let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);


  describe('/POST setPatients', () => {
        it('Verify patient insertion', (done) => {
            let patients = {
            	"id":"541d25c9-9500-4265-8967-240f44ecf723",
            	"name":"teste",
            	"age":100,
            	"acceptedOffers":100,
            	"canceledOffers":0,
            	"averageReplyTime":1
            }
              chai.request('http://localhost:3100')
              .post('/api/setpatients')
              .send(patients) 
              .end((err, res) => {
                  res.should.have.status(200);

                done();
              });
        });

    });
  
    describe('/POST  patient attendance score', () => {
        it('Verify patient attendance score ', (done) => {
            let coordenates = { 
                latitude: 51.5104, 
                longitude: 7.49397
            }
              chai.request('http://localhost:3100')
              .post('/api/getpatients')
              .send(coordenates)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  expect(res.body).to.have.length(10);
                done();
              });
        });

    });
 