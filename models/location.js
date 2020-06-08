/**
 * Class Location
 * Used to create a location object, so distance between locations can be calculated easily
 */
class Location {

    /**
     * Location class attributes
     */
    lat;
    lon;

    /**
     * Location constructor
     * Creates an instance of the Location class
     * @param lat
     * @param long
     */
    constructor(lat, long) {
        this.lat = lat;
        this.lon= long;
    }
}

module.exports = Location