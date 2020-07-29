let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

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
  
    describe('/POST grade', () => {
        it('Verify grade result', (done) => {
            let coordenates = { 
                latitude: 51.5104, 
                longitude: 7.49397
            }
              chai.request('http://localhost:3100')
              .post('/api/getbestgradepatients')
              .send(coordenates)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                done();
              });
        });

    });
 