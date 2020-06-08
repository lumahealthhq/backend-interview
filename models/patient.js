const Distance = require('geo-distance');
const Location = require('./location')

/**
 * Class Patient
 * Used to create a patient object, so we can compare easily the distance between locations
 */
class Patient {

    /**
     * Patient class attributes
     */
    id;
    age;
    location;
    acceptedOffers;
    canceledOffers;
    averageReplyTime;
    score;

    /**
     * Patient constructor
     * @param patient
     * Receives an object as parameter, and then proceeds to create a new object with a set of properties
     * Also, while being created, calls a function to calculate an initial score of the patient
     */
    constructor(patient){
        this.id = patient.id;
        this.age = patient.age;
        this.location = new Location(patient.location.latitude, patient.location.longitude);
        this.acceptedOffers = patient.acceptedOffers ? patient.acceptedOffers : 0;
        this.canceledOffers = patient.canceledOffers ? patient.canceledOffers : 0;
        this.averageReplyTime = patient.averageReplyTime ? patient.averageReplyTime : 0;
        this.score = this.calculateScore();
    }

    /**
     * calculateStore
     * Function that calculates an initial score for a patient based on its informations
     * For more details about the calculations inside this functions, please consult the documentation
     * @returns {number}
     */
    calculateScore(){
        let ageCategory = this.age / 100;
        let acceptedOffersCategory = this.acceptedOffers ? (this.acceptedOffers / 100) * 3 : 0;
        let cancelledOffersCategory = this.canceledOffers ? 3 - ((this.canceledOffers / 100) * 3) : 0;
        let replyTimeCategory = this.averageReplyTime ? 2 - ((this.averageReplyTime / 3600) * 2) : 0;
        return ageCategory + acceptedOffersCategory + cancelledOffersCategory + replyTimeCategory;
    }

    /**
     * calculateDistance
     * Function that calculates the distance between the facility location and the patient's location
     * For more details about the calculations inside this function, please consult the documentation
     * @param facilityLocation
     */
    calculateDistance(facilityLocation){
        /* Calculates the distance between the faility and the patient*/
        let facilityPatient = Distance.between(facilityLocation, this.location).human_readable();
        /* Calculates the score for this category and updates the total score of the patient*/
        this.score += 1 - (facilityPatient.distance / 20000);
        /* Converts the total score of the patient from a float into a int */
        this.score = Math.round(this.score)
    }

    /**
     * getAcceptedOffers
     * Return the number of accepted offers of a patient
     * @returns {number}
     */
    getAcceptedOffers(){
        return this.acceptedOffers;
    }

    /**
     * getCanceledOffers
     * Return the number of canceled offers of a patient
     * @returns {number}
     */
    getCanceledOffers(){
        return this.canceledOffers;
    }

}

module.exports = Patient