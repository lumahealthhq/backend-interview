# Luma Technical Interview

##### Author: Carlos Mendoza (carlosjmendoza91@gmail.com)

## Package Documentation

###How to use:

You can easily import the library, placing it on the same folder that you
will use it.

Then, all you have to do is require it, like this:

`const Processor = require('../backend-interview')`

The ideal setup for this package is to be used along expressJS. You can install expressJS in your project using:

`npm install express`

So, once you install expressJS, you can add something like this in your project:

```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/patients', (req, res) => {
    if (req.query.lat && req.query.lon){
        let processor = Processor.createProcessor(req.query.lat, req.query.lon);
        res.send(processor.getPatientsList());
    } else {
        res.send({message: 'Please inform the exact location of the facility as query parameters (ex: lat=0.0000&lon=-0.0000) and try again'});
    }

})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
```

It is very important to always send the latitude (`lat`) and longitude (`lon`) of the facility as query parameters.

###Structure of the project:

The project is based on 3 javascript files:

* **index.js**: Main file, that exposes methods to interact with the package
* **/models/patient.js**: Class that represents the information of a patient
* **/models/location.js**: Class that represent a real world location, with coordinates

Now, let's proceed to explain in detail every function inside each of those files:

#### index.js

File that contains the definition of the class 'Processor'. Uses different libraries to work correctly (fs, path, underscore).

* **constructor(lat, lon)**: Method that creates and returns an instance of the processor class.
Once is created, it creates an instance of a Location using the parameters received, and then
proceeds to load the data from the file that contains the information of the patients. After this, 
it starts an interation over all of the objects loaded from the file, and creates objects of type Patient,
then call a method of the Patient class to calculate the distance between the patient and the facility; then it
populates the list of the Processor class.

* **getPatientsList()**: Method that returns the final list of the top 10 patients, after executing some processing in it.
The purpose of this function is not only to return the processed list of patients, but also to verify if there are any patients
with little behavior data (and processing them accordingly).

*Note: I am assuming that if a patient doesn't have any information regarding the number of accepted and/or canceled offers, then it has little behavior data*

The method iterates over all of the list of patients, and determines the ones with little behavior data. Those are pushed to an array, to keep track of them.
It is important to mention that in case that there are any patient with little behavior data, then the algorithm will proceed to calculate a random amout of patients to put into the top list.
This amount of patients could go from 1 to 10. 

If the amount of patients equals to 10 or the same size of the original list of patients, then the method will return the list of patients with little behavior data entirely.
Otherwise, it will proceed to do the following:

- Generates an array of random indexes that will be used to select random patients with little behavior data
- Obtain a copy of the first 10 places of the original list of patients loaded from the file
- Generates an array of random indexes that will be used to select patients inside the top 10 randomly
- Shuffle the list of patients with little behavior data
- Finally, allocates patients with little behavior data randonly in random indexes of the top 10 list

* **getRandomIndexes()**: This is a method that is used by the getPatientsList function. Basically, it receives a parameter
which serves as the amount of random indexes that needs to return. All of those indexes are based on an array of integers, from 0 to 9.
For example, if the getPatientsList requires a list of 2 indexes inside an array of 10 elements, then the function will return 2 numbers from 0 to 9.

#### patient.js

File that contains the definition of the class 'Patient'. Uses the `geo-library` package to calculate the distance between the facility and the patient.

It has several attributes to represent the informations of a patient:

* id
* age
* location
* acceptedOffers
* canceledOffers
* averageReplyTime
* score

* **constructor(object)**: The constructor function of the class sets all of properties of the object it receives to its attributes.
Also, it calls the function to calculate an initial score of the patient.

* **calculateScore()**: Calculates the initial score of a patient based on its data, except the location.
This is how the algorithm calculates the score of the patient:

The score goes from 1 to 10. And there are different categories inside the score that have differente weight.

* age (10%)
* distance to practice (10%)
* number of accepted offers (30%)
* number of cancelled offers (30%)
* reply time (20%)

All of those percentages are parts of a 100%, and in this case, of a 10. So, the list of weights can be interpreted like this, based on 10 points:

* age = 1 point
* distance to practice = 1 point
* number of accepted offers = 3 points
* number of cancelled offers = 3 points
* reply time = 2 points

How are each one of those points calculated?

* Age Category: Taking as a limit age 100 years, we can calculate a quotient dividing the age of the person by 100. This will give us a quotient
that expresses that the older the patient, the higher this part of the score will be. This is because older people in general tend to need more medical assistance.
`ageCategory = age/100`

* Accepted Offers Category: Taking as a limit 100 accepted offers, we can calculate a quotient dividing the accepted offers by 100, and then multiplying by 3 to represent the 30% of the category. This will give us a quotient
that expresses that the more accepted offers the patient registered, the higher this part of the score will be. It makes sense to offer appointments to people who have a tendency to accept them.
`acceptedOffersCategory = (acceptedOffers/100) * 3`

* Canceled Offers Category: Taking as a limit 100 canceled offers, we can calculate a quotient dividing the accepted offers by 100, and then multiplying by 3 to represent the 30% of the category. But in this case,
the result is subsctracted from the total 30% of the category. This will give us a quotient that expresses that the less canceled offers the patient registered, the higher this part of the score will be. It is ideal to offer the apointments to the patients who have small amounts of cancelations .
`canceledOffersCategory = 3 - ((this.canceledOffers / 100) * 3)`

* Reply Time Category: Basing this calculation in 3600 seconds = 1 hour, we can calculate a quotient dividing the average reply time by 3600, and then multiplying by 2 to represent the 20% of the category. Also in this case,
the result is subsctracted from the total 20% of the category. This will give us a quotient that expresses that the less time to reply the patient registered, the higher this part of the score will be. It would be easier and more efficient to offer an appointment to a patient who replies fast when contacted.
`replyTimeCategory = 2 - ((this.averageReplyTime / 3600) * 2)`

* **calculateDistance(facilityLocation)**: Method that calculates the distance between the patient and the facility, using coordinates from both.
It receives the location of the facility, and using the `geo-distance` library, calculates the distance in kilometers.
For this calculation, it was considered a search area of 20.000 km around the facility.
To calculate this part of the total score, the function divides the distance previously calculated by 20.000, and then subcstracts this quotient from the total 10% of this category.
The principle behind this calculation is that, the farther the patient is from the facility location, the less points will score in this category. 
Patients who live near the facility can have more probability of attending the apointments. At the end of this function, the score is updated and transformed into a integer.
`distanceFromFacilityScore = 1 - (distanceFromFacility / 20000)`

* **getAcceptedOffers()**: Method that returns the number of accepted offers of a patient.

* **getCanceledOffers()**: Method that returns the number of canceled offers of a patient.

#### location.js

File that contains the definition of the class 'Location'. This class was created to standarize the handling of the locations,
because is an element present in the facility and the patient. It was better to set a standard to help with the calculation of the distance. 