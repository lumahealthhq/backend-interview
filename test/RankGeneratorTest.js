const expect = require('chai').expect;

import RankGenerator from "../RankGenerator";

describe('RankGenerator#constructor', function() {
    let rankGenerator;

    beforeEach(function() {
        rankGenerator = new RankGenerator();
    });

    it('should be the right instance', function() {
        expect(rankGenerator).to.be.instanceOf(RankGenerator);
    });

    it('has empty patient data', function() {
        expect(Object.keys(rankGenerator._patientData).length).to.be.equal(0);
    })
});

describe('RankGenerator#loadPatientData', function() {
    let rankGenerator;

    beforeEach(function() {
        rankGenerator = new RankGenerator();
        rankGenerator.loadPatientData('./sample-data/patients.json');
    });

    it('loads patient data', function() {
        expect(Object.keys(rankGenerator._patientData).length).to.be.above(0);
    });

    it('has an associated entry', function() {
        expect(Object.values(rankGenerator._patientData)[0]).to.have.property('entry');
    });

    it('has an associated score', function() {
        expect(Object.values(rankGenerator._patientData)[0]).to.have.property('score');
    });
});

describe('RankGenerator#fetchBestPatients', function() {
    let bestPatients, rankGenerator;

    beforeEach(function() {
        rankGenerator = new RankGenerator();
        rankGenerator.loadPatientData('./sample-data/patients.json');
        bestPatients = rankGenerator.fetchBestPatients({
            "latitude": "47.6391",
            "longitude": "23.2362"
        });
    });

    it('has a list of best patients', function() {
        expect(bestPatients.length).to.be.above(0);
    });

    it('Best patients have scores', function() {
        const firstPatient = bestPatients[0];
        expect(firstPatient).to.have.property('score');
        expect(firstPatient.score).to.be.an('number');
        expect(firstPatient.score).to.be.within(1, 10);
    });

    it('is in descending order by score', function() {
        const listDifference = bestPatients[0].score - bestPatients[bestPatients.length - 1].score;
        expect(listDifference).to.be.above(0);
    });

    it('changes based on location', function() {
        const differentBestPatients = rankGenerator.fetchBestPatients({
            "latitude": "-10.1998",
            "longitude": "-57.4325"
        });

        expect(differentBestPatients).to.not.equal(bestPatients);
    });
});

describe('RankGenerator#_getSortedPatientList', function() {
    let sortedPatients, rankGenerator;

    beforeEach(function() {
        rankGenerator = new RankGenerator();
        rankGenerator.loadPatientData('./sample-data/patients.json');
        sortedPatients = rankGenerator._getSortedPatientList(rankGenerator._patientData);
    });

    it('has associated score', function() {
        const firstPatient = sortedPatients[0];
        expect(firstPatient).to.have.property('score');
        expect(firstPatient.score).to.be.an('number');
        expect(firstPatient.score).to.be.within(1, 10);
    });

    it('has an associated entry', function() {
        const firstPatient = sortedPatients[0];
        expect(firstPatient).to.have.property('entry');
        expect(firstPatient.entry).to.be.an('object');
    });

    it('is in descending order by score', function() {
        const listDifference = sortedPatients[0].score - sortedPatients[sortedPatients.length - 1].score;
        expect(listDifference).to.be.above(0);
    });
});