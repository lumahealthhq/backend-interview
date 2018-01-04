# Luma Technical Interview

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

## Solution
### Objective:
Patients priority filter based on the demographic and historical data.
An algorithm that will process a set of historical patient data and compute a score for each patient that (1 as the lowest, 10 as the highest) with weighting category.

The patient score is the aggregate of all scores:
  patientScore = (ageScore*10 + distanceScore*10 + acceptedOffersScore*30 + cancelledOffersScore*30 + averageReplyTimeScore*20) / 100;

Where the score of each property is:
#### 1. Age Score
I assume the older the patient will get higher priority.
  // age n=21 is the lowest (score=1)
  // age m=90 is the highest (score=10)

#### 2. Distance Score
I assume the closer of the patient location to the facility will get higher priority.
  // distance n=>10 miles is the lowest (score=1)
  // distance m=0 mile is the highest (score=10)

#### 3. Accepted Offers Score
I assume the more of the patient accepted offers will get higher priority.
  // acceptedOffers n=0 is the lowest (score=1)
  // acceptedOffers m=100 is the highest (score=10)

#### 4. Cancelled Offers Score
I assume the less of the patient patient cancelled offers will get higher priority.
  // canceledOffers n=100 is the lowest (score=1)
  // canceledOffers m=0 is the highest (score=10)

#### 5. Average Reply Time Score
I assume the quicker the patient replied will get higher priority.
  // averageReplyTime n=1 is the highest (score=10)
  // averageReplyTime m=3600 is the lowest (score=1)

Once a set of patients have been scored, then it will take the top 10.

### Patients with low number of historical data
> Take in consideration that patients who have little behavior data should be randomly added to the top list as to give them a chance to be selected.

I made an assumption that a patient that has low number of accepted offers, cancelled offers, and average reply time falls into this criteria. I made an arbitrary threshold that is 5 for number of accepted offers and cancelled offers. While the threshold for average reply time is 300 (5 minutes).
Then I put them into **the top 3 spots** (sorted by patient scores as well).

## Project Structure
The root directory is meant to be a MEAN application (MongoDB-ExpressJS-Angular4-NodeJS). But the MongoDB and data access layer are not implemented yet.

Usage:
```shell
$ npm install
$ npm run server

> luma@0.1.0 server /home/ryan/Documents/workspaces/workspace_nodejs/full-stack-interview
> node server.js

API is running on port 3000
```

Open Angular app at [http://localhost:3000](http://localhost:3000) and api at [http://localhost:3000/api/v1](http://localhost:3000/api/v1).

### luma-priority library (folder `lib/`)
This is the heart of the solution. It is implemented as an npm library and can be published to the npm repository.
I used the TDD (Test Driven Development) methodology. The set of unit tests were written in `lib/test/index.js`, then implementations were coded in `lib/index.js` to pass the tests.

Run the unit tests:
```bash
/workspaces/full-stack-interview$ cd lib/
/workspaces/full-stack-interview/lib$ npm install
/workspaces/full-stack-interview/lib$ npm test

> luma-priority@0.1.0 test /workspaces/workspace_nodejs/full-stack-interview/lib
> mocha --reporter spec

  #luma_priority
    ✓ ping
    ✓ distance in mile

  #scoring Age
    ✓ age 21 is the lowest (score=1)
    ✓ age 90 is the highest (score=10)
    ✓ age 28 is (score=2)

  #scoring AcceptedOffers
    ✓ acceptedOffers 0 is the lowest (score=1)
    ✓ acceptedOffers 100 is the highest (score=10)
    ✓ acceptedOffers 11 is (score=2)

  #scoring CanceledOffers
    ✓ canceledOffers 0 is the highest (score=10)
    ✓ canceledOffers 100 is the lowest (score=1)
    ✓ canceledOffers 11 is (score=9)

  #scoring AverageReplyTime
    ✓ averageReplyTime 3600 is the lowest (score=1)
    ✓ averageReplyTime 1 is the highest (score=10)
    ✓ averageReplyTime 361 is (score=9)

  #scoring Distance
    ✓ distance 0 mile is the highest (score=10)
    ✓ canceledOffers 10 miles is the lowest (score=1)
    ✓ canceledOffers 11 miles is (score=1)

  #scoring Patient
    ✓ patient with the highest (score=10)
    ✓ patient with the lowest (score=1)

  #low historical data
    ✓ patient with low historical data
    ✓ patient without low historical data

  #top 10 patients by patient score
    ✓ patients in order
    ✓ filter patients into ordered patients and low historical data ones


  23 passing (24ms)
```

### API (folder `server/`)
Get the collection of API calls from
[postman collection](https://www.getpostman.com/collections/940e12a2ffa1d16882a9).

The API is also available at [https://luma-priority.herokuapp.com/api/v1](https://luma-priority.herokuapp.com/api/v1)

#### 1. Populate the patients data
Upload the `lib/test/patients.json` file:
```bash
$ curl -X POST \
  http://localhost:3000/api/v1/patients/upload \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -F patients=@$HOME/workspaces/full-stack-interview/lib/test/patients.json
```

#### 2. Get the top 10 scored patients
```bash
$ curl -X POST \
  http://localhost:3000/api/v1/patients/scored \
  -H 'Content-Type: application/json' \
  -d '{
    "latitude": "46.7110",
    "longitude": "-63.1150"}'
```

#### 3. Check the patient scores
Paste the list of patients to the "patients" array:
```bash
curl -X POST \
  http://localhost:3000/api/v1/patients/checkScores \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 8a427588-e942-af39-d8dd-44c2f82739ff' \
  -d '{
	"facilityLocation": {
	    "latitude": "46.7110",
	    "longitude": "-63.1150"
	},
	"patients": [...]
}'
```

### UI (folder `src/`)