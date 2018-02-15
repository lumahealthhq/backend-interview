# LumaWaitlist

A Javacript class to generate an optimized waitlist / call list for hospitals everywhere.

## Problem Definition

A busy hospital has a list of patients waiting to see a doctor. The waitlist is created sequentially (e.g. patients are added in a fifo order) from the time the patient calls.  Once there is an availability, the front desk calls each patient to offer the appointment in the order they were added to the waitlist. The staff member from the front desk has noticed that she wastes a lot of time trying to find a patient from the waitlist since they&#39;re often not available, don&#39;t pick up the phone, etc.  Enter LumaWaitList!!!

## API

## Creating a WaitList

```javascript
var patients = [
  {
    "id": "e39be75b-c31e-4c7b-ba7f-ae54a4e22d90",
    "name": "Izabella Rowe",
    "location": {
      "latitude": "56.8498",
      "longitude": "107.9686"
    },
    "age": 79,
    "acceptedOffers": 26,
    "canceledOffers": 26,
    "averageReplyTime": 3120
  }
];

var LumaWaitlist = require('lumawaitlist');
var lumaWaitList = new LumaWaitlist().init(patients);
```

## Getting the top 10 patients most likely to respond.
```javascript
var practice = {
  "latitude": "63.1565",
  "longitude": "-122.7370"
};
var waitlist = this.lumaWaitList.getTop10Patients(practice);
```