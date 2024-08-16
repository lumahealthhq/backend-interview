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

## How this algorith works:

This algorithm can be broken down into several key steps designed to ensure data validation, normalize input for comparison, and ultimately return a balanced list of users based on behavior data and scoring. Here’s a concise summary:

1. Data Validation:

- Validate dataset structure and contents to ensure they conform to expected formats, given Node.js is not strongly typed.
- Validate the geographic coordinates (latitude/longitude) to prevent unexpected behavior.

2. Offer Calculation:

- Compute the total number of offers (accepted + rejected) for each user to assess the amount of behavioral data available.

3. Distance Calculation:

- Use the distance formula to calculate the distance between users and a facility. This is done for simplicity and practicality.

4. Normalization:

- Normalize different data fields to a 0-1 scale for easier comparison across various units (e.g., distance vs. age).

5. Score Calculation:

- Apply predefined weights to the normalized values to calculate a score for each user, adding a new column to the dataset.

6. List Generation:

- Generate two lists: one prioritizing users with fewer behavioral data points and another ordered by the calculated scores.
- Randomly determine how many users from the "less data" list should be selected, and fill in the remainder from the "higher score" list.

7. Result Return:

- Return a balanced list that accounts for users with less behavioral data, ensuring they have a fair chance to be considered.

This approach balances the need to consider both data-rich and data-poor users by combining scoring with a randomized selection process.

## Acknowledgements

- [How to Find the Distance Between Two Points](https://www.wikihow.com/Find-the-Distance-Between-Two-Points)
- [Normalization](https://www.codecademy.com/article/normalization)

## Authors

- [@ymoreiratiti](https://github.com/ymoreiratiti)
