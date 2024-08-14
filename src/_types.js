/**
 * @typedef Location
 * @type {object}
 *
 * @property {string} latitude
 * @property {string} longitude
 */

/**
 * @typedef Patient
 * @type {object}
 *
 * @property {string} id
 * @property {string} name
 * @property {Location} location
 * @property {number} age
 * @property {number} acceptedOffers
 * @property {number} canceledOffers
 * @property {number} averageReplyTime
 */

/**
 * @typedef MinMax
 * @type {object}
 *
 * @property {number} min
 * @property {number} max
 */

/**
 * @typedef MinMaxPatientValues
 *
 * @property {MinMax} age
 * @property {MinMax} acceptedOffers
 * @property {MinMax} canceledOffers
 * @property {MinMax} averageReplyTime
 */
