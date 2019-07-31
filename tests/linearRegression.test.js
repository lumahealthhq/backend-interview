const {trainModel} = require('../data/linearRegression');
let chai = require('chai');
let trainingPatients = require('../data/trainingPatients');
let expect = chai.expect;


describe('Testing linearRegression functions', () => {
    let trainModelReturn = trainModel();

    it('Should have more then 20 patients to train model', () => {
        expect(trainingPatients).to.have.lengthOf.above(20)
    });

    it('Should run model training without errors', () => {
        expect(trainModelReturn).to.equal(true)
    });


});
