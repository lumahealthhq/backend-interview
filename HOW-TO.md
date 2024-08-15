# Requirements

- Nodejs v20.11.1

# Technologies

- Typescript
- Nest.js
- Swagger
- Class validator and Class transforme
- Jest

# Modules

## Distance Module

This module is responsible for exposing a service class that will calculate the distance between two points on the globe using the Haversine method.

## Normalization Module

This module is responsible for exposing a service class that will normalize data based on maximum and minimum values.

- Positive normalization: The higher the number, the better the score.
- Negative normalization: The higher the number, the worse the score.

## Ranking Module

This module is responsible for exposing a service class. This class is responsible for using the **Distance Module** to calculate the distance of the patient from the position provided in the API. It will retrieve the maximum and minimum values for age, accepted offers, canceled offers, average response time, and distance, to normalize (using the **Normalization Module**) these values and **calculate the behavioral, demographic, and overall scores**. Patients are then sorted by the best overall score and worst score by behavior.

## Patient Module

This module is responsible for retrieving patients from the JSON file and using the **Ranking Module**. It will return the number of ranked patients requested in the request according to the required page.

## Assumptions

### Age Normalization

For age normalization, I assumed that younger patients would have a better score for this criterion.

### Accepted Offers Normalization

For accepted offers normalization, I assumed that patients with a higher number of accepted offers would have a better score for this criterion.

### Canceled Offers Normalization

For canceled offers normalization, I assumed that patients with a lower number of canceled offers would have a better score for this criterion.

### Average Response Time Normalization

For average response time normalization, I assumed that patients with a lower average response time would have a better score for this criterion.

### Distance Normalization

For distance normalization, I assumed that patients with a smaller distance would have a better score for this criterion.

## How to Use

1.  Clone the [repository](https://github.com/Poggioli/backend-interview).
2.  Navigate to the repository folder.
3.  Rename the `.env.example` file to `.env`.
4.  Run the following command to install dependencies:

```bash
yarn
# or
npm install
```

5.  To start the application, run the following command:

```bash
yarn start
# or
npm start
```

6.  The server will be responding on the URL http://localhost:3000/patients/waitlist?lat=-50.53&long=-108.98
You can change the lat and long values to any value. You can also access the **[Swagger](http://localhost:3000/api#/patients/PatientsController_getWaitlist)** of the application to test it.

7.  Validations:

- **page**: optional value, **default 1**. When provided, it must be a numeric value, with 1 being the smallest accepted value.

- **perPage**: optional value, **default 10**. When provided, it must be a numeric value, with 1 being the smallest accepted value.

- **lat**: required value representing the latitude of the provided position, must have a **minimum value of -90** and a **maximum value of 90**.

- **long**: required value representing the longitude of the provided position, must have a **minimum value of -180** and a **maximum value of 180**.

- **percentLittleBehavior**: optional value, **default 20**. When provided, it must be a numeric value, with a **minimum value of 20** and a **maximum value of 100**.

## Tests

1. Run the following command to run tests:
 ```bash
yarn test:cov
# or
npm run test:cov
```