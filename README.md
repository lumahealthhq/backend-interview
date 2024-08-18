# Luma Technical Interview

## Requirements

Ensure you have the following installed:

- **Node.js**: Version 20.9.0 or higher
- **npm**: Version 10.1.0 or higher


## Running the Project

To install the project dependencies, run:

- `npm install`

For unit tests with coverage, use:

- `npm run test:unit:cov`

## Library

This project is designed as a library that you can import and use via a single function:

```node
import { createPatientPriorityList } from './index.js'
```

The createPatientPriorityList function generates a priority list of patients who are most likely to accept an appointment offer, based on their data and a facility location. It accepts the following parameters:

```node
createPatientPriorityList({
    patients, // Array of patients following the structure in patients.json
    facilityLatitude, // Latitude coordinate of the facility (e.g., -81.1386)
    facilityLongitude, // Longitude coordinate of the facility (e.g., 108.1122)
    listSize, // Number of patients required in the list (default: 10)
    littleBehavioralDataListPercentage // Percentage of patients with little behavioral data to include in the list (default: 0.4)
})
```

## API

To validate the implementation of the library, an API endpoint is provided. You can start the server with:

- `npm run start:server`

The server will run on port `3000` by default.

The API provides a single endpoint:

- `GET /v1/patients`

This endpoint expects two query parameters:

- `latitude` (number): The latitude of the facility.
- `longitude` (number): The longitude of the facility.

Example Request: 

`GET /v1/patients?latitude=-81.1386&longitude=-155.1633
`

--------------

## Problem Definition

A busy hospital has a list of patients waiting to see a doctor. The waitlist is created sequentially (e.g. patients are added in a fifo order) from the time the patient calls.  Once there is an availability, the front desk calls each patient to offer the appointment in the order they were added to the waitlist. The staff member from the front desk has noticed that she wastes a lot of time trying to find a patient from the waitlist since they&#39;re often not available, don&#39;t pick up the phone, etc.  She would like to generate a better list that will increase her chances of finding a patient in the first few calls.

## Interview Task

Given patient demographics and behavioral data (see sample-data/patients.json), create an algorithm that will process a set of historical patient data and compute a score for each patient that (1 as the lowest, 10 as the highest) that represents the chance of a patient accepting the offer off the waitlist. Take in consideration that patients who have little behavior data should be randomly added to the top list as to give them a chance to be selected. Expose an api that takes a facility's location as input and returns an ordered list of 10 patients who will most likely accept the appointment offer.

## Weighting Categories

Demographic

- age  (weighted 10%)
- distance to practice (weighted 10%)

Behavior

- number of accepted offers (weighted 30%)
- number of cancelled offers (weighted 30%)
- reply time (how long it took for patients to reply) (weighted 20%)

## Patient Model

- ID
- Age (in years)
- location
  - Lat
  - long
- acceptedOffers (integer)
- canceledOffers (integer)
- averageReplyTime (integer, in seconds)

## Deliverables

The code should be written as a Node.js as a library that anyone can import and use. It should contain documentation and unit tests that show your understanding of the problem. Once you&#39;re finished, submit a PR to this repo.
