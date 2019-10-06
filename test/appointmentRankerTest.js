const expect = require('chai').expect;

import AppointmentRanker from "../src/appointment-ranker";

describe('AppointmentRanker#constructor', function() {
  let appointmentRanker;

  beforeEach(function() {
    appointmentRanker = new AppointmentRanker();
  });

  it('Init test', function() {
    expect(appointmentRanker).to.be.instanceOf(AppointmentRanker);
  });

  it('Empty patient data', function() {
    expect(Object.keys(appointmentRanker._patientData).length).to.be.equal(0);
  })
});

describe('AppointmentRanker#updateFromHistoricalData', function() {
  let appointmentRanker;

  beforeEach(function() {
    appointmentRanker = new AppointmentRanker();
    appointmentRanker.updateFromHistoricalData('./sample-data/patients.json');
  });

  it('Update from historical data', function() {
    expect(Object.keys(appointmentRanker._patientData).length).to.be.above(0);
  });

  it('Include staticScore', function() {
    expect(Object.values(appointmentRanker._patientData)[0]).to.have.property('staticScore');
  });
});

describe('AppointmentRanker#getTopPatients', function() {
  let topPatients;

  beforeEach(function () {
    const appointmentRanker = new AppointmentRanker();
    appointmentRanker.updateFromHistoricalData('./sample-data/patients.json');
    topPatients = appointmentRanker.getTopPatients();
  });

  it('Get top patients', function () {
    expect(topPatients.length).to.be.above(0);
  });

  it('Top patients have scores', function () {
    const firstPatient = topPatients[0];
    expect(firstPatient.score).to.be.an('number');
  });

  it('Top patients are ordered', function () {
    // TODO: Make sure the whole list is ordered, not just the ends
    const listDifference = topPatients[0].score - topPatients[topPatients.length-1].score;
    expect(listDifference).to.be.above(0);
  });
});



describe('AppointmentRanker#getTopPatientsForLocation', function() {
  let appointmentRanker, topPatients;

  beforeEach(function () {
    appointmentRanker = new AppointmentRanker();
    appointmentRanker.updateFromHistoricalData('./sample-data/patients.json');
    topPatients = appointmentRanker.getTopPatientsForLocation({
      latitude: "-46.2905",
      longitude: "108.2977"
    });
  });

  it('Get top patients for location', function () {
    expect(topPatients.length).to.be.above(0);
  });

  it('Top patients have scores', function () {
    const firstPatient = topPatients[0];
    expect(firstPatient.score).to.be.an('number');
  });

  it('Top patients are ordered', function () {
    // TODO: Make sure the whole list is ordered, not just the ends
    const listDifference = topPatients[0].score - topPatients[topPatients.length-1].score;
    expect(listDifference).to.be.above(0);
  });

  it('Different locations yield different results', function() {
    const differentTopPatients = appointmentRanker.getTopPatientsForLocation({
      latitude:"46.7110",
      longitude:"-63.1150"
    });

    expect(differentTopPatients).to.not.equal(topPatients);
  });
});