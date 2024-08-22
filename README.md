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

----------------

# How to install

- clone the repo
- `npm install`
- `npm run build`
- go to your own project then `npm install <path/to/this/repo>`
- then you can add in your javascript/typescript file:

```javascript

const { listOfWeightedPatients } = require("backend-interview");

// as a test you can run the following
console.log(listOfWeightedPatients(10, 10));
```

# How to test

```bash
npm test
```

# How it works

The module exposes a function called `listOfWeightedPatients` that receives `latitude:number` and `longitude:number` as parameters. There are some validations to make sure the values are in accordance to the expected values (see [About latitude and longitude](https://learn.microsoft.com/en-us/previous-versions/mappoint/aa578799(v=msdn.10)?redirectedfrom=MSDN)).

The function returns 10 items in a list.

## The list's contents

Given a coordinate (x,y), the program will return a list of 7 patients that are more likely to be the target audience, plus 3 more (at the top of the list) that have little behavioral data available. The first three will have no scores of their own in the returned list.

## How the list is generated

First, the arguments (coordinates) are validated. Then, the provided file (`sample-data/patients.json`) is read and its contents are adjusted to make `location` an object with numbers instead of strings to make calculations easier. Then all the weighting process is done and the remaining 3 patients are added to the list.

## How the weighting works

There are 5 processes done to generate the weights

### by age 

File: `src/utils/weighters/age/index.js`
Calculation module: `src/utils/weighters/lib/by-mid-or-target-value/index.js`

Here we calculate the mid point between the oldest and youngest patient in the list as no direction was given on how to calculate this specific field (but the function that does this calculation also accepts a `targetValue` if you wanted to pick a specific age to focus on). Then we figure our how much each patient deviates from this midpoint and normalize this value to then calculate the weight.

### by distance

File: `src/utils/weighters/distance/index.js`
Calculation module: `src/utils/weighters/lib/by-lowest-value/index.js`

First we calculate the distance of each patient to the coordinates provided. Then, having this distance in hand, we check one by one who is the closest to the coordinate. Again, just like `by age`, the value is normalized and then we calculate the weights

### by accepted offers

File: `src/utils/weighters/accepted-offers/index.js`
Calculation module: `src/utils/weighters/lib/by-highest-value/index.js`

The calculation checks for the highest number of accepted offers. The higher the number, the higher the score.

### by cancelled offers

File: `src/utils/weighters/cancelled-offers/index.js`
Calculation module: `src/utils/weighters/lib/by-lowest-value/index.js`

The calculation checks for the lowest number of cancelled offers. The lower the number, the higher the score.

### by average reply time 

File: `src/utils/weighters/reply-time/index.js`
Calculation module: `src/utils/weighters/lib/by-lowest-value/index.js`

The calculation checks for the lowest time. The lower the number, the higher the score.

All the values are summed and then we have the total score for each patient. The value is a float.

## Dealing with the patients with low behavioral data

File: `src/services/low-behavioral-data-patient-picker/index.ts`

The idea is simple:

- sort the list of patients by accepted or cancelled offers (this is choosen at random), lowest on top, highest at the bottom
- get the first 10 of the list
- return it.

To prepend those patients in the list we will return to the user, we first check if they are already there in the list of 7 we picked first. If the patient is not there already, we prepend the record to the list. We keep doing it until the list has 10 items.


### Notes

- I goofed a bit in some types and didn't have time to fix them. Sometimes I `as unknown`ed some types to make things work.
