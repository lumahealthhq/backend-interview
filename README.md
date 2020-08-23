# patient-recommender

An api that provides a client list recommendation for a given position.

# How to run

## Prerequisites

- Node
- Yarn

## Running

- First, install the dependencies by running

  `yarn install`

- Then start the application by running

  `yarn start`

  This will start the application on the default port (8000).

  To specify a given port, run

  `SERVER_PORT=<port> yarn start`

  For example, if desired to run the http server at port 8080, then we should run

  `SERVER_PORT=8080 yarn start`

- And to run tests,

  `yarn test`

# API

Application base URL: /api/v1

## Retrieve list of recommended patients

- **URL**

  /patient/queue

- **Method**

  `GET`

- **Query Params**

  **Required:**

  `latitude=[number]`

  `longitude=[number]`

- **Success Response:**

  **Status Code:** 200 (OK)

  **Body content:** json list of recommended patients.

- **Error Response:**

  **Status Code:** 422 (Unprocessable Entity)

  **Body content:** `{ error: "Cannot process empty values" }`

  OR

  **Status Code:** 500 (Internal Server Error)

  **Body content:** `{ error: "Internal error, please try again later" }`

- **Request example:**

  `http://localhost:8000/api/v1/patient/queue?latitude=37.791050&longitude=-122.401932`

  Will return 10 patients that will most likely accept appointment offers for a facility located at 37.791050 latitude and -122.401932 longitude.

# Implementation decisions

For the recommendation, it was decided to pick the first 7 patients with the highest score (behavior score + demographic score). The 3 other ones are picked randomly within a slice of the left patients with the highest demographic score (instead of just choosing the ones with smallest behavior scores). By taking this decision, I'm focusing on recommending the more promising ones while not disconsidering the ones with smallest behavior scores as well.
