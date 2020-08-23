const isString = (value) =>
    typeof value === "string" || value instanceof String;

const capitalizeFirstLetter = (word) =>
    word && isString(word) ? word.charAt(0).toUpperCase() + word.slice(1) : "";

const getRandomArbitrary = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

module.exports = { capitalizeFirstLetter, getRandomArbitrary };
