# Luma Technical Interview - Solution By David Warthen

##Overview

I considered a couple of approaches to solving this task.

The first was to use the information provided in a simple ranking formula, such as:<br>
score = sum-of-weighted-positive-parameters - sum-of-weighted-negative-parameters

or<br>
score = sum-of-weighted-positive-parameters / sum-of-weighted-negative-parameters

(You would first want to normalize the parameters before plugging them into such a formula.)

This would have been a common way to approach the problem ten or fifteen years ago, and can still be useful when you have little data, need a quick solution, etc .

The second and more contemporary approach is to use simple machine learning to attack the problem.  This is 
the approach I selected for my solution to this task.  There is enough data, and the solution will adjust 
as additional data becomes available to keep it optimized.  There were no stringent performance requirements
specified, so I did not consider performance in my implmenetation, other than it should not be unreasonably
slow given the test data set.  I did use the weights as they were part of the problem definition, but you
do not really need pre-determined weights for this solution.

I implemented a linear regression.  I initially anticipated I would then want to convert it to a logistic 
regression, but the coefficient of determination was strong enough that this did not in the end seem 
necessary.

##The Module

Include the two files getMostLikelyPatients.js and linear-regression.js in your JavaScript directory.

Add the following line of code where you want to access the module:

const getMostLikelyPatients = require('./js/getMostLikelyPatients.js');

You will need to install tensor-flowJS, as well as jasime to run the tests.  (See the package.json file.)

getMostLikelyPatients(lat, lon, numberToGet)<br>
lat - the latitude of the office<br>
lon - the longitude of the office<br>
numberToGet - the number of patients to return on the list. default=10, range 1..100

returns - an array of the most likely patients to accept the new appontment offer.  If there are patients
with insufficient data, one of these is selected at random and put at the top of the list.

If there is any problem, an empty array is returned.  The id, name, and score (1 to 10) is returned for each
patient.  (If the patient has insufficient data, then the score for that patient is -1.)

##The project structure

The work is performed in two files, getMostLikelyPatients.js and linear-regression.js (both in the js 
subdirectory).  The patients.json file is in the data subdirectory, and the test files are in the test 
subdirectory.

getMostLikelyPatient.js - loads the data, structures the lists to be trained, and creates and uses the LinearRegression class instance.

linear-regression-js - implements the LinearRegression class.  The constructor method, the train method, and the predict method
are used for normal operation.  There is also a test method, which is used for evaluating the model.  This
module uses tensorflow to do the matrix operations required for training and using the linear regression model.

To avoid extra external dependencies, int this project I did not include other NPM modules I commonly use.  These might
include winston for logging, the lodash utility module, for example.  I also did not use JSDoc, as I would
for a larger project (especially to automatically generate HTML docuemntation).


--
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
