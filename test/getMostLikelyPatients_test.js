const getMostLikelyPatients = require("../js/getMostLikelyPatients.js");

//console.log(getMostLikelyPatients(37.7749,122.4194));
describe('getMostLikelyPatients test suite', () => {
    it('test out-of-range latitude parameters', () => {
        //    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
        const result = getMostLikelyPatients(-200, -122);
        expect(result.length).toBe(0);
    });

    it('test out-of-range longitude parameters', () => {
        //    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
        const result = getMostLikelyPatients(47, -200);
        expect(result.length).toBe(0);
    });

    it('out of range value of 0 for numberToGet parameter', () => {
       const result = getMostLikelyPatients(47, -122, 0);
       expect(result.length).toBe(0);
    });


    it('out of range value 1000 for numberToGet parameter', () => {
        const result = getMostLikelyPatients(47, -122, 1000);
        expect(result.length).toBe(0);
    });

    it ('valid parameters and successful result', () => {
        const result = getMostLikelyPatients(47, -122);
        expect(result.length).toBe(10);
    });
}); //end describe
