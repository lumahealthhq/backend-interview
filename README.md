# Luma Technical Interview

## Requirements

To run this app I recommend you to use Node.JS v12.13.0 or higher. I built this using Node v12.13.0, and haven't tested it on other versions. Also, you will need
a node package manager (npm or yarn) installed on your computer as well.

## Running The Project

By default the app will run on port 3000 of your environment. You can set the `PORT` environment variable to a different number in case you want to run the app on
a different port:

  $ export PORT=3000

In order to start the app, run the following commands from the project's root folder on your terminal:

    $ npm install
    $ node app

The app only has one route - `GET /v1/generate-patients-list?` - which expects two query parameters: 

  - `lat` numerical string ranging from -90.0 to 90.0
  - `lon` numerical string ranging from -180.0 to 180.0

An example of a valid call to this api would be - `/v1/generate-patients-list?lat=46.7110&lon=20.8874`  

Upon a valid call, this api will return a list of ten patients most likely to accept an offer off the waitlist given the facility location determined by the `lat` and `lon` parameters.

The waitlist is located in the file `/sample-date/patients.json`

## patient-ranking.js

This module is used by the ``/v1/generate-patients-list` api and contains the following methods: 
  
  - `generatePatientList(patients, facilityLocation, listSize=10)` 
  - `calculatePatientsDistanceToFacility(patients, facilityLocation)`
  - `findPatientDataRanges(patients, SCORE_COMPOSITION, bottomThreshold=0.1)`
  - `calculatePatientsScore(patients, dataRanges, SCORE_COMPOSITION)`
  - `sortPatients(patients, finalListLength, littleBehaviorDataPercentage=0.1)`

It is only necessary to call `generatePatientList` in order to obtain an ordered list of patients, each with score ranging from 1 - 10 which represents the likelihood of a patient accepting an offer of the waitlist.

`facilityLocation` is an object of the following format:
```
  {
    latitude: float,
    longitude: float
  }
```

`generatePatientList` calls the other methods in the module in order to do its job. If you want to learn more about how these other methods work please take a look at the code and the comments.

There are a few unit tests for patient-ranking.js in the file `patient-ranking.test.ts` located on lib folder. To run these tests execute:

    $ npm run test

on your terminal from the root folder of the project.


## Problem Definition

A busy hospital has a list of patients waiting to see a doctor. The waitlist is created sequentially (e.g. patients are added in a fifo order) from the time the patient calls. Once there is an availability, the front desk calls each patient to offer the appointment in the order they were added to the waitlist. The staff member from the front desk has noticed that she wastes a lot of time trying to find a patient from the waitlist since they&#39;re often not available, don&#39;t pick up the phone, etc. She would like to generate a better list that will increase her chances of finding a patient in the first few calls.

## Interview Task

Given patient demographics and behavioral data (see sample-data/patients.json), create an algorithm that will process a set of historical patient data and compute a score for each patient that (1 as the lowest, 10 as the highest) that represents the chance of a patient accepting the offer off the waitlist. Take in consideration that patients who have little behavior data should be randomly added to the top list as to give them a chance to be selected. Expose an api that takes a facility's location as input and returns an ordered list of 10 patients who will most likely accept the appointment offer.

## Weighting Categories

Demographic

- age (weighted 10%)
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
- distanceToPractice (double, in meters)
- score (integer 1 - 10)
- littleBehaviorData (boolean)

## Deliverables

The code should be written as a Node.js as a library that anyone can import and use. It should contain documentation and unit tests that show your understanding of the problem. Once you&#39;re finished, submit a PR to this repo.

