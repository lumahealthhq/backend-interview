const fs = require('fs');
const path = require('path');
const Patient = require('./models/patient');
const Location = require('./models/location')
const _ = require('underscore');

/**
 * Class Patient
 * Main class, which has to be instantiated using the location of the facility
 */
class Processor {

    /**
     * Array of patients loaded from the file
     * @type {*[]}
     */
    patients = [];

    /**
     * Processor constructor
     * Creates an instance of the class, receiving the latitude and longitude of the facility as parameters
     * Reads the file, parses it, and populate the patientList with Patient objects
     * @param latFacility
     * @param lonFacility
     */
    constructor(latFacility, lonFacility){
        /* Creates a Location object using the data recevied as parameter*/
        let facilityLocation = new Location(latFacility, lonFacility);
        /* Reads and parses the data from the file of patients */
        let rawdata = fs.readFileSync(path.join(__dirname, '/sample-data/patients.json'));
        let patientsList = JSON.parse(rawdata);
        /* Iterates over the list of patients, and populates the patients list of the class with Patient objects */
        patientsList.forEach((patient) => {
            /* Creates a new patient object with data read from the file */
            let newPatient = new Patient(patient)
            /* Calculates the distance of the patient from the facility */
            newPatient.calculateDistance(facilityLocation)
            /* Adds the patient to the list of the patients in this class */
            this.patients.push(newPatient)
        })
    }

    /**
     * getPatientsList
     * Function that returns the list of the 10 patients with the most probability of accepting the offer
     * For more details about the calculations inside this function, please consult the documentation
     * @returns {any}
     */
    getPatientsList(){
        let unknownPatients = [];
        /* Sort the list of patients, acording to their scores */
        let finalResult = _.sortBy(this.patients, 'score').reverse();
        /* Evaluates if there are any patient with little behavioral information*/
        _.each(finalResult, (p) => {
           if(!p.getAcceptedOffers() || !p.getCanceledOffers()){
               unknownPatients.push(p);
           }
        });
        if (unknownPatients.length > 0 ){
            let newList = [];
            /* Determine the quantity of the patients with little behavior data that will be selected*/
            let quantityPatientsList = finalResult.length > 10 ? 10 : finalResult.length;
            let maxUnknownPatients = _.random(1, quantityPatientsList);
            /* Checks the amount of patients with little data who will be added to the list.
                Case the amount is 10 or the same as the initial list of patients, returns the list
                 of patients with little behavior data instead. */
            if (maxUnknownPatients === 10 || maxUnknownPatients === finalResult.length){
                newList = unknownPatients.length > 10 ? unknownPatients.slice(0, 9) : unknownPatients;
                return _.shuffle(newList);
            } else {
                /* Calculates an array of random indexes that will be used to select random patients
                * with little behavior data */
                let randomIndexesUnkown = this.getRandomIndexes(maxUnknownPatients);
                let selectedUnkwownPatients = [];
                _.each(randomIndexesUnkown, (i) => {
                    selectedUnkwownPatients.push(unknownPatients[i]);
                });
                /* Obtain a copy of the first 10 places of the original list of patients loaded from the file */
                let finalResultSlice = finalResult.slice(0, 10);
                /* Calculates an array of random indexes that will be used to select patients
                * inside the top 10 randomly */
                let finalUnknownIndexes =  this.getRandomIndexes(maxUnknownPatients);
                /* Shuffle the list of patients with little behavior data */
                selectedUnkwownPatients = _.shuffle(selectedUnkwownPatients);
                /* Allocates patients with little behavior data randonly in random indexes of the top 10 list */
                for(let i = 0; i <= maxUnknownPatients-1; i++){
                    finalResultSlice[finalUnknownIndexes[i]] = selectedUnkwownPatients[i];
                }
                return finalResultSlice;
            }
        }
        return finalResult.length > 10 ? finalResult.slice(0, 10) : finalResult;
    }

    /**
     * getRandomIndexes
     * Function that return an array of integers that represent random indexes of an array of 10 elements
     * For more details about the calculations inside this function, please consult the documentation
     * @param maxLimit
     * @returns {[]}
     */
    getRandomIndexes(maxLimit) {

        /* Intialize an array with numbers from 0 to 9*/
        let indexes = _.range(10);
        /* Array to store the random indexes generated */
        let randomIndexes = [];
        /* Variable to store temporarily the random index obtained from the indexes array */
        let selectedIndex = 0;
        for(let i = maxLimit-1; i>=0; i--){
            /* Calculates a random number between 0 and 9 */
            let randomIndex = Math.floor(Math.random()*indexes.length);
            /* Removes the element on the indicated position accordin to the random number */
            selectedIndex = indexes.splice(randomIndex, 1);
            /* Store the element on the array of random indexes */
            randomIndexes.push(selectedIndex[0]);
        }
        return randomIndexes;
    }

}

exports.createProcessor = (lat, lon) => {
    return new Processor(lat, lon);
}
