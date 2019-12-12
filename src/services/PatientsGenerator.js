const faker = require('faker');
const thresholds = require('../config/thresholds');

class PatientsGenerator {
  call(patientsQty) {
    return this.generatePatients(patientsQty);
  }

  get randomId() {
    return faker.random.uuid();
  }

  get randomName() {
    return faker.name.findName();
  }

  get randomLatitude() {
    return faker.address.latitude();
  }

  get randomLongitude() {
    return faker.address.longitude();
  }

  get randomAge() {
    const { min, max } = thresholds.age;
    return faker.random.number({ min, max });
  }

  get randomOffersQty() {
    const { min, max } = thresholds.offers;
    return faker.random.number({ min, max });
  }

  get randomReplyTime() {
    const { min, max } = thresholds.averageReplyTime;
    return faker.random.number({ min, max });
  }

  get randomLocation() {
    const { randomLatitude: latitude, randomLongitude: longitude } = this;
    const location = { latitude, longitude };

    return location;
  }

  generatePatient() {
    const {
      randomId: id,
      randomName: name,
      randomLocation: location,
      randomAge: age,
      randomReplyTime: averageReplyTime,
    } = this;

    const acceptedOffers = this.randomOffersQty;
    const canceledOffers = this.randomOffersQty;

    const patient = {
      id,
      name,
      location,
      age,
      acceptedOffers,
      canceledOffers,
      averageReplyTime,
    };

    return patient;
  }

  generatePatients(patientsQty) {
    const patients = [];

    for (
      let currentPatient = 0;
      currentPatient < patientsQty;
      currentPatient += 1
    ) {
      patients.push(this.generatePatient());
    }

    return patients;
  }
}

module.exports = new PatientsGenerator();
