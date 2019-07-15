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

## Solution Documentation

To run the application execute the command - docker-compose up --build
After that, to populate the Database, go to the folder sample-data and run - sh rebuild-database.sh

The exposed endpoint address is /api/v1/patients/suggestion and it should be accessible on localhost:3000 as a POST request. Its body should contain an object
informing a coordinate in the following format:

{
	"coordinates": {
		"latitude": -28.1879,
		"longitude":-67.7477
	}
}

The endpoint will return a JSON with a list of 10 patients using its model format plus the calculated score. To achive this final score, the api calculates each patient score in every single category and apply the respective weights. For each category, the system finds the lowest and the highest value (among every patient) and calculates a normalized value between 1 and 10 depending on the category value and its relation to the previous found extremes. For the categories canceledOffers and averageReplyTime, the score is inverted (for example, an 8 means a 2) because a high score here means a behavior that makes the acceptance of the appointment offer less likely. The age category score favours older people since a greater age means a greater score. For the distance, the api calculates the distance in meters between the patient's location and the given facility location (in the body of the request) and apply the same normalization rule for the given value. In conclusion, patients that are older (and tends to have more health problems), living closer (easier to go to the facility) that cancel less offers ( more concerned with their health) and reply faster will be on the top of the list.