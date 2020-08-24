const NormalizationService = require("../src/services/NormalizationService");
const PatientWrapper = require("../src/models/PatientWrapper");

const patients = [
    {
        id: "541d25c9-9500-4265-8967-240f44ecf723",
        name: "Samir Pacocha",
        location: {
            latitude: "46.7110",
            longitude: "-63.1150",
        },
        age: 46,
        acceptedOffers: 49,
        canceledOffers: 92,
        averageReplyTime: 2598,
    },
    {
        id: "41fd45bc-b166-444a-a69e-9d527b4aee48",
        name: "Bernard Mosciski",
        location: {
            latitude: "-81.0341",
            longitude: "144.9963",
        },
        age: 21,
        acceptedOffers: 95,
        canceledOffers: 96,
        averageReplyTime: 1908,
    },
    {
        id: "b483afb8-2ed7-4fd2-9cd6-c1fd7071f19f",
        name: "Mathew Halvorson",
        location: {
            latitude: "-75.6334",
            longitude: "-165.8910",
        },
        age: 26,
        acceptedOffers: 80,
        canceledOffers: 22,
        averageReplyTime: 2315,
    },
];
const pws = patients.map(PatientWrapper.Factory);

describe("set features minima and maxima method", () => {
    test("should update minimum and maximum if lesser or greater values are found", () => {
        const minMaxObj = {
            minAge: Infinity,
            maxAge: -Infinity,
        };

        NormalizationService._setFeatureMinMax("age", minMaxObj, pws[0]);

        expect(minMaxObj.minAge).toEqual(46);
        expect(minMaxObj.maxAge).toEqual(46);
    });
});

describe("set minima and maxima for all patients", () => {
    test("should set minimax values taking in consideration the given feature list", () => {
        const minMaxObj = {
            minAge: Infinity,
            maxAge: -Infinity,
        };

        const svc = new NormalizationService(["age"]);

        svc._setMinMaxForAllPatients(pws, minMaxObj);

        expect(minMaxObj.minAge).toEqual(21);
        expect(minMaxObj.maxAge).toEqual(46);
    });
});

describe("normalize features method", () => {
    test("should normalize considering the max as 10 and min as 1", () => {
        const minMaxObj = {
            minAge: 21,
            maxAge: 46,
        };

        const svc = new NormalizationService(["age"]);

        svc._normalizeFeatures(pws, minMaxObj);

        expect(pws[0].normAge).toEqual(10);
        expect(pws[1].normAge).toEqual(1);
        expect(pws[2].normAge).toEqual(
            1 +
            ((patients[2].age - minMaxObj.minAge) * (10 - 1)) /
            (minMaxObj.maxAge - minMaxObj.minAge)
        );
    });
});
