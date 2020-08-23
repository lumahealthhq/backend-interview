const isString = (value) =>
    typeof value === "string" || value instanceof String;

/**
 * Returns the given word with the first leter capitalized.
 * If the given input is invalid (not a string), an empty string ("") is returned.
 * 
 * @param {String} word The string.
 * @returns String with its first letter capitalized if input is valid. Blank string otherwise.
 */
const capitalizeFirstLetter = (word) =>
    word && isString(word) ? word.charAt(0).toUpperCase() + word.slice(1) : "";

/**
 * Returns an integer within the interval [min, max).
 * 
 * @param {Number} min Minimum value.
 * @param {Number} max Maximum value.
 */
const getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

module.exports = { capitalizeFirstLetter, getRandomArbitrary };
