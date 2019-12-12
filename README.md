# Luma Health - Back-end Test Solution

## Running the code

**Install all npm modules**

`npm install`

**Initialize the server**

`npm start`

## Process description

- The API user should pass the `facilityLocation` latitude and longitude as request body to `/patients/rank` route
  - The user can also pass a patients list inside the request.body, otherwise, the PatientsGenerator service will be called and generate 30 random patients
- The PatientsRanker service will be called and will do the magic

## The magic behind PatientsRanker service

1. Calls scoreAllPatients() method, that will calculate each patient score based on categories weights;
2. Calls .sortPatients() method that will sort all patients based on theirs scores;
3. Then, it will generated a limited list (just a slice of the original array - only 10 patients with more score);
4. Calls ScoreNormalizer to each limitedOrderedList (it uses the https://en.wikipedia.org/wiki/Feature_scaling formula to rescaling inside the grade range - 1 to 10 points).

## Endpoint

> GET /patients/rank

| Property                    | Type                                              |
| --------------------------- | ------------------------------------------------- |
| facilityLocation (required) | object with latitude and longitude                |
| patients (optional)         | array of patients objects                         |
| patientsQty (optional)      | number of patients objects that will be generated |
