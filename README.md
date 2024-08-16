# Luma Technical Interview

Given patient demographics and behavioral data (see sample-data/patients.json), create an algorithm that will process a set of historical patient data and compute a score for each patient that (1 as the lowest, 10 as the highest) that represents the chance of a patient accepting the offer off the waitlist. Take in consideration that patients who have little behavior data should be randomly added to the top list as to give them a chance to be selected. Expose an api that takes a facility's location as input and returns an ordered list of 10 patients who will most likely accept the appointment offer.

## Installation

1. Clone the repository

```shell
git clone https://github.com/ymoreiratiti/backend-interview.git
cd backend-interview
```

2. Install NPM Packages

```shell
npm ci
```

2. Build the package

```shell
npm run build
```

## Usage/Examples

```javascript
//  Import Library
const { PatientScoringAlgorithm } = require("./lib");

//  Import Patients Sample Data
const sampleDate = require("./sample-data/patients.json");

//  Create a new instance of PatientScoringAlgorithm using the sample data
const patientScoringAlgorithm = new PatientScoringAlgorithm({
  dataset: sampleDate,
});

//  Get the patient list
const result = patientScoringAlgorithm.getPatientList({
  latitude: "48.7120",
  longitude: "-60.1170",
});
console.table(result);
```

## Run Locally

Install this package

```shell
node example.js
```

## Running Tests

To run tests, run the following command

```shell
npm run test
```

Coverage

```shell
npm run test:cov
```

Mutation Test

```shell
npm run test:mutant
```

## Acknowledgements

- [How to Find the Distance Between Two Points](https://www.wikihow.com/Find-the-Distance-Between-Two-Points)
- [Normalization](https://www.codecademy.com/article/normalization)

## Authors

- [@ymoreiratiti](https://github.com/ymoreiratiti)
