# Full Stack Technical Interview - Submission by Reggie Brown

## Overview

The first step to completing this challenge was to identify the type of problem presented. My initial thought was to do a simple calculation to determine the difference between the positively and negatively weighted parameters. However, it is not clear what parameters are positive and which are negative (e.g. is age positive or negative?).

I decided that it is unnecessary to know ahead of time which params are good or bad. To predict what patients will most likely accept an appointment offer, we only need to know the relationship between the patients' demographic information and historical behavior (canceled and accepted appointments). This is a multivariate regression problem: We need to predict the output of a continuous value.

Next, I began to think about what tools could be used to assit in solving the problem. Machine Learning (ML) is overkill for this sample size but it would be ideal for production because predictions would improve as the data set grows and the model is optimized. There are many ML libraries available for Node.js , and I've choosen to use a library that I've some experience with, TensorFlow (TF). I have used TF in other projects that deal with classification problems, but this is a chance to use TF to solve a regression problem.

- Beyond my previous experience with the library, there are additional benefits to using TensorFlow:
  - open-source
  - great documentation
  - active developer community

## Project Structure

- The majority of the work is done in two files:
  - getPatientCallList.js (returns the top 10 call list)
  - tfLinearregression.js (builds and trains our model, and then makes predictions)
- ./dataUtils :
  - getDistanceToPractice.js (calculates the distance between patient and practice)
  - normalization.js (normalizes tensors for TensorFlow model)
  - getPreparedData.js (prepares the patient data for training)

## How to run the app:

- Install dependencies: `npm i`
- Run App: `npm start`
  - This will start the app and express server
  - Console will log a preconfigured link that will hit the API endpoint `/getPatientCallList/:lat/:long/:listLength`
  - Follow the pre-configured link and view the results in your browser,
    - The patient list is also logged to the console
  - Patient Data Structure:
    - id, name, score (1-10). Patients with insufficient data are given a score of -1

## Planning for the future:

- Better testing
- es6 modules
- Provide the TF model different training and testing data sets
- Optimize the performance of TF for production
- Centralize a logging service
- Documentation
- variable names (I've made them as explicit as possible here, and some are extremely long)

# Luma Technical Interview

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

## Deliverables

The code should be written as a Node.js as a library that anyone can import and use. It should contain documentation and unit tests that show your understanding of the problem. Once you&#39;re finished, submit a PR to this repo.
