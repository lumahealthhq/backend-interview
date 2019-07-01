# Luma Health - Patient ranker

## Description

This module aims to provide other Luma microservices functionalities related to statistical analyses of patients, aiming to outline the best fitting ones.

## Installation

To use this module, just run a simple *npm install* or *yarn add*. Don't forget that this module is *scoped*, so the company prefix (@lumahealth) is part of the package's name.

## Usage

### Simple patient ranker

The most simple usage is the simple patient ranker function, which uses patients' data itself to build simplified statistical analyses in order to rank patients based on virtual performance ratings. The source code below describes how to use it.

```
const { top10Patients } = require('@lumahealth/patient-ranker');

const facilityLocation = { latitude: -45.232, longitude: 43.742 };
const top10Patients = getBestPatientOptions(myfile.json, facilityLocation);
```
