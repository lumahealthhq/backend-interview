const { capitalizeFirstLetter } = require("./utils");

describe("capitalize first letter method", () => {
    test("should return the given string with the first letter capitalized", () => {

        expect(capitalizeFirstLetter("lumaHealth")).toEqual("LumaHealth");
        expect(capitalizeFirstLetter("lUCAS CROCOMO")).toEqual("LUCAS CROCOMO");
    });
});

describe("capitalize first letter method", () => {
    test("should return empty string if given string is NOT valid", () => {

        expect(capitalizeFirstLetter("")).toEqual("");
        expect(capitalizeFirstLetter(null)).toEqual("");
        expect(capitalizeFirstLetter(undefined)).toEqual("");
        expect(capitalizeFirstLetter(2)).toEqual("");
    });
});