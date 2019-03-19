# Generate Call List

**Note:** It's unclear from the problem statement whether a patient's age should positively or negatively correlate with their score. I've assumed that a higher age results in a lower score, but that can easily be changed.

## Description

Given a properly formatted medical practice location and an array of properly formatted patient data, returns an array of relevant patient data and scores sorted from highest to lowest score. A high score indicates a high potential for an appointment to be successfully scheduled if the patient is called.

To give patients with a smaller set of historical data a chance to be placed higher on the list—and thereby accumulate more data for future lists—the following method of randomized padding is used.

The patient with the largest sample size of previous offers (`acceptedOffers + canceledOffers`) is used as the standard. For every other patient, the difference is calculated between their sample size and that standard. A random integer is generated up to that difference and added to their `acceptedOffers`, always leaving `canceledOffers` unmodified. This assures that patients' scores may be randomly raised, never randomly lowered, and the degree of randomness scales exactly with the relevant gap in data.

## Usage

```javascript
const generateCallList = require('generate-call-list');
const rawPatientData = require('raw-patient-data.json');

const practiceLocation = {
  latitude: 37.790413,
  longitude: -122.4046877,
};

// The options parameter is optional, these are the defaults 
const options = {
  scoreMin: 1,
  scoreMax: 10,
  listSize: 10,
  factorWeights: {
    age: 0.1,
    distance: 0.1,
    acceptedOffers: 0.3,
    canceledOffers: 0.3,
    averageReplyTime: 0.2
  },
};

const orderedCallList = generateCallList(practiceLocation, rawPatientData, options);
```

### Patient data format

```json
[{
  "id": "541d25c9-9500-4265-8967-240f44ecf723",
  "name": "Samir Pacocha",
  "location": {
    "latitude": "46.7110",
    "longitude": "-63.1150"},
    "age": 46,
    "acceptedOffers": 49,
    "canceledOffers": 92,
    "averageReplyTime": 2598
  }
}]
```