var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var toptenpatients = require('toptenpatients');
var should = chai.should();
chai.use(chaiHttp);
describe('/POST book', () => {
    // obj = JSON.parse(data);
  var address = {
    "street":"3001 South Michigan Avenue",
    "city": "Chicago, USA"
};

  it('Response should be processed', (done) => {
        chai.request(server.app)
              .post('/address')
              .send(address)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('Array');
              done(err);
            });
      });
    });
