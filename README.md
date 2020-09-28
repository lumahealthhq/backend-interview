# Luma Technical Interview

## Requirements

This application was built on Node.JS v12.14. It has not been tested on other versions. You will also need a package manager (npm or yarn).

## Running

First, you need to install all dependencies

    $ npm install // or yarn

Second, you need to start the project by using the following command:

    $ npm start // or yarn start

The application will run on port 3000. To execute it on another port, use the command:

    $ SERVER_PORT=[port] npm start

To run the tests, use:

    $ npm test


# API

The application has only one route: `GET /v1/generate-list`

It expects two parameters:

  - `lat`   number
  - `long`  number

For example:

`/v1/generate-list?lat=-26.5030&long=-155.1633`

It will return 10 patients that will most likely attend the appointment in a facility that is located at latitude of -26.5030 and longitude of -155.1633


# Problem Definition

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
