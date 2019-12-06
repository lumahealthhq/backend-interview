# Patient Ranker

Healthcare facilities spend a large amount of time attempting to get a hold of patients. Patients are liable to cancel appointments, fail to respond in a timely fashion, and take other actions that can generally lower a facility's efficiency in filling schedules.

Patient Ranker is a customizable library that provides a framework for ranking the patients' likelihood of accepting appointments based on historical data.

It accepts patient historical data and outputs a ranked list of the patients most likely to respond.

### Prerequisites

This library was built on Node v8.6.0.

It is written in ES6, meaning you must run it with esm for it to run properly.

```
$ node -r esm {your project}
```

## Getting Started

First, install the library.

```
$ npm install @jahmezz/patient-ranker
```

Import the RankGenerator module into your project. Then, Load your patient data as JSON.

```
import RankGenerator from '@jahmezz/patient-ranker/RankGenerator'
let patientRanker = new RankGenerator();
patientRanker.loadPatientData({your patient data});
```

Then, request a list of patients using patientRanker.fetchBestPatients(facilityLocation).

This function accepts an object containing latitude and longitude.
The output is a sorted array of the patients most likely to accept an appointment offer.

### Input
```
let facilityLocation = {
    "latitude": "68.8129",
    "longitude": "71.3018"
}
let bestPatients = patientRanker.fetchBestPatients(facilityLocation);
console.log("Score: " + bestPatients[0].score);
console.log("ID: " + bestPatients[0].entry.id);
console.log("Name: " + bestPatients[0].entry.name);
```

### Output
```
Score: 9.26
ID: 9902ce99-e4aa-434b-a5b5-49f2ae156391
Name: Laurine Kshlerin
```

An index.js (/example/index.js) is included with the project that you can run and review as an interactive demo.

```
$ node -r esm index.js
```

## Running the tests

Run the following command:
```
$ npm test
```

The test suite consists of unit tests ensuring the functions in this library work properly.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/jahmezz/full-stack-interview/tags).

## Authors

* **James Kahng** - *Initial work* - [jahmezz](https://github.com/jahmezz)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Much inspiration drawn from Akash's solution to the interview question.
