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


## Api Endpoints


Post  url =/api/setpatients , parameter = patients[] ,  parameter example	{	"id":"541d25c9-9500-4265-8967-240f44ecf723",
																				"name":"ramiro",
																				"age":100,
																				"acceptedOffers":100,
																				"canceledOffers":0,
																				"averageReplyTime":1,
																				"location":{
																					"latitude":"32.9053",
																					"longitude":"7.6264"
																				}
																			}

Post  url =/api/getbestgradepatients  ,parameter= coordenates , parameter example 	{ latitude: 51.5104, longitude: 7.49397 }


## Api dependencies
 	"body-parser": "^1.19.0",
    "chai": "^4.2.0",
    "chai-http": "^4.3.0",
    "cookie-parser": "^1.4.5",
    "cors": "^2.8.5",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "faker": "^4.1.0",
    "geolib": "^3.3.1",
    "mocha": "^8.0.1",
    "mongoose": "^5.9.26",
    "morgan": "^1.10.0",
    "uuid": "^8.3.0"

## Api test command
   npm test




