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

#### Main technologies
- JavaScript
- ES6
- Node.js (v10.15.2)
- NPM (v6.4.1)
- Express
- Jest

#### NPM Scripts
- start app: `npm start`
- start app in another PORT: `PORT=8000 npm start`
- eslint: `npm run check`
- run tests `npm test` (jest)

#### Environment
Application runs on port 3000 by default

#### Testing the solution
- execute `npm install` (to install the dependencies)
- execute `npm test` (to execute the unit tests)
- execute `npm start` (to start the application)

After starting the app, you can open the following link on the web browser to check the 
solution running for the sample data:

http://localhost:3000/api/v1/waitlist/suggestion/from-sample

\
You can process a different dataset, doing a `POST` to the following endpoint:

http://localhost:3000/api/v1/waitlist/suggestion

JSON body:


    {
        "facilityLat": "68.8129",
        "facilityLng": "71.3018",
        "dataset": [
              {
                "id": "213097a3-cae1-48cf-b266-a361a972ff27",
                "name": "Tamara Roberts",
                "location": {
                    "latitude": "68.8129",
                    "longitude": "71.3018"
                },
                "age": 51,
                "acceptedOffers": 100,
                "canceledOffers": 2,
                "averageReplyTime": 87
            }
        ]
    }


The API will return an ordered *waitlist*, as the following example:

    [{
        "id": "213097a3-cae1-48cf-b266-a361a972ff27",
        "name": "Tamara Roberts",
        "location": {
        "latitude": "68.8129",
        "longitude": "71.3018"
        },
        "age": 51,
        "acceptedOffers": 100,
        "canceledOffers": 2,
        "averageReplyTime": 87,
        "score": 4,
        "hasEnoughBehaviorData": true
    }]

Example to call the API using `curl`:

`curl` -X POST http://localhost:3000/api/v1/waitlist/suggestion -d '{"facilityLat": "68.8129", "facilityLng": "71.3018", "dataset": [{
            "id": "213097a3-cae1-48cf-b266-a361a972ff27",
            "name": "Tamara Roberts",
            "location": {
                "latitude": "68.8129",
                "longitude": "71.3018"
            },
            "age": 51,
            "acceptedOffers": 100,
            "canceledOffers": 2,
            "averageReplyTime": 87
        } ]}' -H "Content-Type: application/json"

