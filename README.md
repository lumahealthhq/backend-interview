# Luma Patient Sorter

Given a list of patients and their record, decide which 10 patients are most likely to accept an offer of an available appointment slot.

## Installation

The application is written in Python 3.7 and uses [Poetry](https://python-poetry.org/) for project management. Assuming one has Python correctly installed to their path and are currently residing in the cloned copy of this repository:

1) [Install Poetry](https://python-poetry.org/docs/#installation): `curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python`
1) Install dependencies: `poetry install`
1) Run application: `poetry run flask run`

## Configuration

There are a couple of environment variables you can provide:

* `FLASK_PORT`: what port to run the local server on, default is 5000.
* `PATIENT_DATA_FILE`: where the JSON file is containing patient data, defaults to `./data/patients.json`

## Data set

The data set can be regenerated using `./generate_data.py [--outfile=filename] [--number=50]`.

## API

The API is exposed via the web browser at `/patients/ranked`. It has the following parameters available to it:

| Name    | Description                                                   | Required | Default |
|---------|---------------------------------------------------------------|----------|---------|
| `lat`   | Latitude of the provider's office                             | Yes      |         |
| `lon`   | Longitude of the provider's office                            | Yes      |         |
| `limit` | How many sorted patients to return                            | No       | 10      |
| `luck`  | Whether or not to include a lucky† participant (yes/no/maybe) | No       | "maybe" |

† "Lucky" means randomly selecting a patient with a score of < 5.0 to be bumped to the top of the list.

## Design considerations

For this project I chose to go with Python as developing REST APIs using Flask is quick and easy without a ton of boilerplate routing code and so forth you find so common in NodeJS projects. Plus I just happen to know Python better.

Additionally, Python has the _excellent_ Pandas library, which is suited for the data analysis we did here. This was my first foray into using Pandas, so there is possibly some optimization that could be done with a more experienced hand. But it was a great learning experience.

## Testing

Run the unit tests like this:

```sh
poetry run coverage run -m pytest --cov=patient_sorting -v tests
```

## TODO

Things to go back to later:
* Dockerizing the service
* Come up with a better algorithm. Real data sets would drive this effort.
  * There's no discussion as to whether age is a good metric or a bad one or both. Common sense says really young patients (like 21) are less likely to need the appointment and are more likely to miss it. But is there an age where age-related reasons would cause one to be late?
  * The weight given to distance is likely a sliding scale. When it's 2 miles versus 5 miles, 0.1 makes sense. But once you hit 50 miles, or 100, it probably outweighs most other factors.
  * Speaking of distance, it should probably be a negative factor
  * Time to answer call seems like an odd metric. Does 10s vs 15s really matter? Does anyone even answer at 1 second? Does the receptionist really call for 1 hour before giving up? I'd argue that "time to answer call" has zero bearing on how likely they are to accept the appointment.
  * Worth visiting: perhaps use the ratio of accepted to declined appointments instead of the difference between them.
* Swagger spec for the API


## Weighting Categories

- Demographic
  - age  (weighted 10%)
  - distance to practice (weighted 10%)
- Behavior
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
