const getScoredPatients = require('../index');
let chaiHttp = require('chai-http');
let chai = require('chai');
let patients = require('../data/patients');

chai.use(chaiHttp);
let expect = chai.expect;
let app = 'http://localhost:7000';
describe('API endpoints should work as needed', async () => {
    it('Should answer correctly on base endpoint', () => {
            chai.request(app)
                .get('/').then(value => {
                expect(value.text).to.equal('Welcome to API')
            }).catch((reason => {
                console.log(reason)
            }))
        }
    );

    it('Should have exactly 10 patients on response', () => {
        chai.request(app).get('/scoredPatients?lat=30.674367&lon=-14.961152').end((err, res) => {
            expect(res.body.patients).to.have.lengthOf(10);
        });
    });

    it('The first patient must be a little behavior patient with a score of 1 if there is any patient with little behavior data', () => {
        chai.request(app).get('/scoredPatients?lat=10.312043&lon=-40.292301').end((err, res) => {
            let hasLittleBehaviorDataPatient = patients.some(patient => {
                return (patient.acceptedOffers + patient.canceledOffers) < 5;
            });
            if (hasLittleBehaviorDataPatient) {
                expect(res.body.patients[0].score).to.equal(1)
            } else {
                console.log('No little behavior data patient')
            }
        });

    });


});

