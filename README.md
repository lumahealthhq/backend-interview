# Introduction
This is my submission to the [Luma Health backend interview assigment](https://github.com/lumahealthhq/backend-interview), it is:
- a simple library you can import and use to create a list of top priority patients for a given hospital call;
- a RESTful API that given a hospital coordinates (latitude, longitude) it returns a waitlist of patient most likely to pick a call from the hospital.

# Requirements
- **Node.js**: Version 20.9 or higher;
- **npm**: Version 10.0 or higher.

# Quickstart
There's three ways to play with this submission:
1. I've deployed the REST API at AWS as a ECS instance; **feel free to acess it here** [http://luma.inacio.codes/docs](http://luma.inacio.codes/docs)
2. If you prefer to play with the lib itself, I have also publish to npm:
```bash
npm install inacio-luma-patient-recommender
```
- And then you can simply use with:
```js
import { PatientsRecommender, generatePatientsData } from 'inacio-luma-patient-recommender'

const patients = generatePatientsData(100)
const patientsRecommender = new PatientsRecommender(patients)

// Coordinates of San Francisco
const latitude = 37.77
const longitude = -122.41

const recommended = patientsRecommender.recommend(latitude, longitude)

console.log(recommended)
```
3. Or you can also install and use it locally:
```bash
git clone https://github.com/inacioMattos/luma-interview.git
cd luma-interview
npm i
npm run dev
👆 starts the HTTP API at port 3000
```

# Technologies and concepts used
- [Fastify](https://medium.com/deno-the-complete-reference/express-vs-fastify-vs-hapi-vs-koa-hello-world-performance-comparison-dd8cd6866bdd): because it is the [**fastest**](https://medium.com/deno-the-complete-reference/express-vs-fastify-vs-hapi-vs-koa-hello-world-performance-comparison-dd8cd6866bdd) pure Node.js HTTP library;
- [Weigthed k-d trees](https://www.perplexity.ai/search/what-s-weighted-k-d-trees-jqrhQRYkRBa.nkfefXTkQA): a super fast and efficient data structure that allows for $O(log (n))$ retrieval;
- Testing: [Jest](https://jestjs.io/) for unit testing, Fastify's testing module for e2e and [Stryker](https://stryker-mutator.io/) for [mutation testing](https://www.perplexity.ai/search/what-s-mutation-testing-06s0P2BDSlOqbybGfznnBA);
- Stress testing: [wrk](https://github.com/wg/wrk) for raw stress testing and [Artillery](https://www.artillery.io/) for real load testing;
- [Docker](https://www.docker.com/): for containerization;
- [AWS ECS](https://aws.amazon.com/ecs/): for deploying the HTTP API;
- [Empirical Bayesian Estimators](https://www.perplexity.ai/search/what-s-a-bayes-estimator-qdi1.kcQSDmL7ELLY7r3zQ): for better computing the scores for `offersAccepted` and `offersCanceled`;
- [Z-scores](https://www.perplexity.ai/search/what-s-z-scores-kRk8uhQ7QwmmIg7nzVU.OQ) (also known as standard score): for elimating the risk of outliers dominating in our patients dataset;
- [Min-Max normalization](https://www.perplexity.ai/search/what-s-minmax-normalization-Wr3fvdCNRdamIaBw7Hp0uA): for normalizing the scores between a certain range;
- [Haversine formula](https://www.perplexity.ai/search/what-s-haversine-distance-c2i5Vod6RDClZmckbc9k2Q): for computing the distance between two pairs of coordinates;
- [Husky](https://typicode.github.io/husky/): to make sure all commits and pushes to Git are not breaking any tests and contain valid Typescript code.

# Table of content
1. [HTTP Endpoints](#endpoints)
2. [Library reference](#implementation)
3. [Algorithm design](#algorithm-design)
4. [Stress testing](#stress-testing)
5. [Available commands](#running-the-project)

<br />

---

# HTTP Endpoints
### `GET /docs`
The [Swagger](http://luma.inacio.codes/docs) endpoint.

### `GET /health`
A [healthcheck](https://microservices.io/patterns/observability/health-check-api.html) route.
<details>
<summary>Why is a `/health` route important?</summary>
Although for this particular challenge it really makes no difference, in a real-world production system a healthcheck route is important for three main reasons:

1.	Monitoring and Availability: Health checks allow monitoring systems to verify that an API is up and running correctly. This helps in ensuring high availability of the service, as it allows for quick detection and response to issues.
2.	Load Balancing: In environments with multiple instances of a service, load balancers use health checks to decide which instances are capable of handling requests. Instances that fail health checks can be automatically removed from the pool, ensuring that traffic is only directed to healthy instances.
3.	Auto-scaling and Orchestration: In cloud environments, health checks are crucial for auto-scaling and orchestration. Systems like Kubernetes and other orchestration tools rely on health check endpoints to manage the lifecycle of containers and services, such as scaling up or down and performing rolling updates without downtime.
</details>

### `GET /api/v1/patients/recommend`
This endpoint recommends a list of patients most likely to pick up a call from the hospital, based on the hospital's location and other optional parameters.

#### Query Parameters:

- `lat` (required): Hospital's latitude
  - Type: number
  - Range: -90 to 90
  - Description: The latitude coordinate of the hospital's location

- `long` (required): Hospital's longitude
  - Type: number
  - Range: -180 to 180
  - Description: The longitude coordinate of the hospital's location

- `limit` (optional):
  - Type: number
  - Default: 10
  - Minimum: 1
  - Description: Number of patients to recommend

- `include_details` (optional):
  - Type: boolean
  - Default: false
  - Description: If set to `true`, the response will include all patient data plus individual scores for each historical feature (ageScore, replyTimeScore, etc.). This is useful for debugging purposes. All scores are weighted by their respective weights.

#### Response:

The endpoint returns a list of recommended patients based on their likelihood to pick up a call from the hospital. The exact structure of the response depends on the `include_details` parameter.

##### Success Response (200 OK):
- When `include_details` is `false` (default):
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "score": 9.67,
    }
  ]
- When `include_details` is true:
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "age": 67,
      "acceptedOffers": 22,
      "canceledOffers": 7,
      "averageReplyTime": 1230,
      "location": {
        "latitude": 87.0444,
        "longitude": 155.0585
      },
      "ageScore": 0.7,
      "replyTimeScore": 1.95,
      "offersScore": 4.4,
      "locationScore": 0.3,
      "score": 7.35
    }
  ]
  ```

### Example usage
```
GET /patients/recommend?lat=37.7749&long=-122.4194&limit=5&include_details=true
```
This request would return a list of 5 recommended patients for a hospital located in San Francisco, including detailed scores for each patient.

### Time complexity
This endpoint has a $O(log(n))$ time complexity where $n$ is the total number of patients. *(Will be explained in depth [below](#implementation))*

<br />

---

# Library reference
## Installation
```bash
npm install inacio-luma-patient-recommender
```

## Usage Example
```typescript
import { PatientsRecommender, generatePatientsData } from 'your-library-name';

// Generate sample patient data
const patients = generatePatientsData(100);

// Create a new recommender instance
const recommender = new PatientsRecommender(patients);

// Get recommendations for a specific hospital location
const recommendations = recommender.recommend(40.7128, -74.0060, 5);

console.log(recommendations);
```

This example generates 100 random patients, creates a recommender instance, and then gets the top 5 recommended patients for a hospital located at latitude 40.7128 and longitude -74.0060.

## Overview
The library exports two main components:
- `generatePatientsData`
- `PatientsRecommender`

### `generatePatientsData()`:
A utility function that generates an array of random `Patient` objects for testing or demonstration purposes
```typescript
function generatePatientsData(numberOfPatients: number): Patient[]
```
- `numberOfPatients`: The number of random patient records to generate.
Returns an array of `Patient` objects.

### `class PatientsRecommender`:
A class that processes patient data and recommends patients who are most likely to accept appointment offers.
```typescript
constructor(patients: Patient[], config?: Partial<RecommenderConfig>)
```
- `patients`: An array of `Patient` objects.
- `config` (optional): A partial `RecommenderConfig` object to customize the recommender's behavior.

### `recommend()` method
```typescript
patientsRecommender.recommend(latitude: number, longitude: number, count?: number): ScoredPatient[]
```
Returns an ordered list of patients most likely to accept a given hospital appointment based on its location.
- `latitude`: Hospital's latitude
- `longitude`: Hospital's longitude
- `count` (optional): Number of patients to return (default: 10)

Returns an array of `ScoredPatient` objects, which include all patient data plus individual feature scores and a final score (1 to 10).

<br />

---

# Algorithm design
The implementation is divided into two major components:
- **Scoring**: How to score each individual patient;
- **Traversing**: Given a hospital coordinates (latitude, longitude) & a patient score, how to traverse through them in order to find the top 10 patients.

Since we can score all patients beforehand, **traversing becomes the important part** since it's what will define our app perfomance (because we'll need to traverse for each new hospital search).

So, let's first dive into how traversing is implemented.

## Traversing

### A O(log n) implementation
To optimize our algorithm, I decided to use a data structure known as [K-d tree](https://www.perplexity.ai/search/tldr-of-what-s-a-kdtree-9XfWdZ1jS1q6iqrzRcKYyA). Its main selling point is the efficient nearest neighbor searches in $O(log(n))$ time on average.

<details>
<summary>What is a K-d tree?</summary>

A K-d tree (k-dimensional tree) is a data structure that allows for efficient nearest neighbor searches in O(log n) time on average. It is an auto-balacing binary tree but for arbitrary d dimensions.
</details>

By leveraging this data structure, we can significantly improve our algorithm's speed. Here's our algorithm's outline:
1. **Preprocessing**: Construct a K-d tree using the patients' data:
    - latitude;
    - longitude;
    - precomputed age score
    - precomputed offers acceptancy rate score;
    - precomputed time to reply score.
2. **Query**: When a hospital request comes in, use the K-d tree to efficiently find the nearest neighbors (potential patients) based on location.
3. **Result**: Return the k-nearest-neighbors.

The standard approach to traversing leads to a time complexity of $O(n)$, while mine approach has a time complexity of $O(log(n))$.
<details>
<summary>Why?</summary>
Let's consider a naive approach to our problem: for each hospital request, we could iterate through all patients, calculate their distance to the hospital, add this to their scores, and then return the top 10 patients. However, this approach raises an important question:

**What happens as the total number of patients grows?**
With this method, the processing time would increase linearly with the number of patients — resulting in a time complexity of O(n). This becomes problematic, especially considering we're calculating the computationally expensive haversine distance for every patient. Fortunately, we can implement a more efficient solution:
</details>

## Scoring
Now let's turn our attention to **scoring** — i.e. how to score a individual patient.

Given this patient:
```json
{
  "name": "Mr. Carmella VonRueden",
  "age": 43,
  "acceptedOffers": 98,
  "canceledOffers": 9,
  "averageReplyTime": 3170,
  "location": {
    "latitude": 87.0444,
    "longitude": 155.0585
  }
}
```
There's three features we can score statically (i.e. before knowing the hospital coordinates):
1. **age**: I assumed the higher the age the better the score;
2. **averageReplyTime**: I assumed the lower the averageReplyTime the better the score;
3. **offers**: This one is a *bit tricky* — I'll go in depth below.

To score one of the static features we simply:
1. **Standardize** it (also known as z-score):
    - $z = \frac{(x - \mu)}{\sigma}$
    - Where $x$ is the value to be standardize, $\mu$ and $\sigma$ are the mean and standard deviation of the $X$ set respectively.
2. **Normalize** it:
    - $normalized = \frac{(z - Z_{\text{min}})}{(Z_{\text{max}} - Z_{\text{min}})}$
    - Where $z$ is the value to be normalized, $Z_{\min}$ and $Z_{\max}$ are the minimum and maximum values in the $Z$ set respectively.
3. Apply its **weight**:
    - $weighted = normalized * W_x$
    - Where $normalized$ is the normalized value you wish apply weighting & $W_x$ is the weight of the respective feature (age, average reply time, etc.).

**The standardization step is significantly important** because it eliminates the risk of having outliers in the patients set.

<details>
<summary>Why?</summary>

Probably the most straightforward way to score those features would be to simply normalize them, putting them in the range of [0, 1] and then multiplying by their weights.

**This is not great**. Why?

Because normalization is vulnerable to outliers — if an outlier is extremely high, **the range of the data becomes unusually large, making the normalized values of other data points inordinately small and tightly clustered**.

<details>
<summary>A bit more on the problems of normalization</summary>

Normalization adjusts the data based on the minimum and maximum values, if outliers are present, they'll significantly skew these minima and maxima, thus distorting the normalized values.

Since *most* every real-world phenomenon follows a normal distribution due to the central limit theorem, there almost certainly will be outliers present.
</details>

We can fix this using standardization!

### Standardization (or z-scores)
Standardization — also known as z-scores — mitigates the impact of outliers more effectively because it is based on the mean and standard deviation. It ensures that:
-	The unit of measurement for variances and covariances is consistent across variables, which is particularly important in models that weigh inputs equally (like many machine learning algorithms).
-	It maintains the relative distances between and within data points, preserving outliers in a way that does not disproportionately influence the overall data structure as much as normalization might.
</details>

Thus, to compute the score for the `age` & `averageReplyTime` features one should simply follow the three steps above. Computing `acceptedOffers` and `canceledOffers`, however, requires one extra-step:

### Computing offers
I've decided to use a [Empirical Bayes Estimator](https://www.perplexity.ai/search/what-s-a-bayes-estimator-qdi1.kcQSDmL7ELLY7r3zQ) since it makes a ton of sense here. Here's its formulation:

$\text{Offer Score} = \frac{C \times m + \text{Accepted Offers}}{C + \text{Total Offers}}$

Where $C$ is the average total offers number and $m$ is the median offer acceptancy rate.

### Why did I choose this approach?
#### Bayes versus additive scoring
Additive score is the idea of: add a 'point' for each accepted offer and subtract a 'point' for each canceled offer. This simplifies to $Offer Score = acceptedOffers - canceledOffers$.

This can be problematic in the following scenario: patient1 has `{ acceptedOffers: 100, canceledOffers: 80 }` and patient2 has `{ acceptedOffers: 18, canceledOffers: 0 }`
- patient1 additive score: $100 - 80 = 20$
- patient2 additive score: $18 - 0 = 18$

#### Bayes versus simple offer acceptancy rate
Suppose a patient1 has `{ acceptedOffers: 1, canceledOffers: 0 }` and patient2 has `{ acceptedOffers: 92, canceledOffers: 2 }`. Using a naive ratio or acceptancy ratio would lead us to rate patient1 as better — which isn't ideal.

Using an empirical Bayes estimator solves both issues.

---


# Stress Testing
I've conducted extensive stress testing to ensure the robustness and performance of the HTTP API under high load conditions. Here are the results:

## Stress with wrk
I used [wrk](https://github.com/wg/wrk) — an industry standard HTTP benchmarking tool written in C — to measure the raw throughput (req/s) of the API:

1. Health Check Endpoint (`/health`):
   - **Performance: 42,000 requests per second**: This demonstrates the efficiency of our barebones API, since this endpoint essentially has no processing.

2. Patient Recommendation Endpoint (`/api/v1/patients/recommend`):
   - **Performance: 37,000 requests per second**: Given the complexity of the patient recommendation algorithm, this throughput is impressive and indicates that the use of K-d tree is leading to an efficient data processing and response generation.

## Load Testing with Artillery
For a more comprehensive load test, I used [Artillery](https://www.artillery.io/), which allows to simulate a realistic traffic pattern:

**Test Scenario:**
- Ramp up from 5 to 500 concurrent users making requests simultaneously over 60 seconds
- Maintain 500 requests per second for 600 seconds (10 minutes)

**Results:**
- No packets dropped or lost throughout the entire test duration.

This test suggests that the API can handle a sudden surge in traffic (from 5 to 500 users) and maintain high performance under sustained heavy load (500 req/s for 10 minutes) without any degradation in service quality.

# Running the project
### `npm run dev`
This will simply run the server in development mode at port 3000.

### `npm run dev:debug`
This will simply run the server in debug mode (additional logs) at port 3000.

### `npm run build`
This will transpile the Typescript code into Javascript

### `npm run start`
This will start the server in production mode — only available after building with `npm run build`

### `npm run build:docker`
This will build a docker container for this service. Useful for deploying to the cloud.

### `npm run start:docker`
This will start the server in production mode using the container previously built with `npm run build:docker`

### `npm run stress`
This will start the stress testing using [wrk](https://github.com/wg/wrk).

**‼️ You must first star the HTTP server at port 3000 by running `npm run dev`**

**⚠️ Please note that this requires to have [wrk](https://github.com/wg/wrk) installed.**

### `npm run load`
This will start the load testing using Artillery.

**‼️ You must first star the HTTP server at port 3000 by running `npm run dev`**

### `npm run test`
This will run the unit tests.

### `npm run test:coverage`
This will run the unit tests + display overall coverage.

### `npm run test:e2e`
This will run the e2e tests.

### `npm run test:mutant`
This will run the mutation tests.

### `npm run lint`
This will run ESLint.
