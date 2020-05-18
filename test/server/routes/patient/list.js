const chai = require("chai");
const {assert} = chai;
chai.use(require("chai-http"));

describe("# API patient", ()=>{
    describe("## GET /", ()=>{
        it("Should get patients sorted by name", async()=>{
            const response = await chai.request(global.server).get("/patient");
            assert.strictEqual(response.status, 200);
            const patients = response.body;
            assert.isNotEmpty(patients);
            const sortedPatients = [...patients].sort((a, b)=>{
                if (a.name!==b.name) return a.name<b.name && -1 || 1;
                return a.id<b.id && -1 || -1;
            });
            patients.forEach((patient, index)=>assert.strictEqual(patient.id, sortedPatients[index].id));
        });
        it("Should get patients sorted by 'distance DESC'", async()=>{
            const response = await chai.request(global.server).get("/patient").query({sort: "distance", sortDirection: "DESC", lat: -20, lng: -40});
            assert.strictEqual(response.status, 200);
            const patients = response.body;
            assert.isNotEmpty(patients);
            const sortedPatients = [...patients].sort((a, b)=>b.distance-a.distance);
            patients.forEach((patient, index)=>assert.strictEqual(patient.id, sortedPatients[index].id));
        });
        it("Should NOT get patients sorted by 'distance DESC' without 'lat' and 'lng' parameters in query", async()=>{
            const response = await chai.request(global.server).get("/patient").query({sort: "distance", sortDirection: "DESC"});
            assert.strictEqual(response.status, 400);
        });
        it("Should NOT get patients sorted by 'distance DESC' when 'lat' and 'lng' parameters in query are not valid numbers", async()=>{
            const response = await chai.request(global.server).get("/patient").query({sort: "distance", sortDirection: "DESC", lat: "foo", lng: "bar"});
            assert.strictEqual(response.status, 400);
        });
        it("Should get patients sorted by 'score DESC'", async()=>{
            const response = await chai.request(global.server).get("/patient").query({sort: "score", sortDirection: "DESC", lat: -20, lng: -40});
            assert.strictEqual(response.status, 200);
            const patients = response.body;
            patients.shift(); // removing the first patient because it might have little bevaviour data, so he might be the random picked to get more info
            assert.isNotEmpty(patients);
            const sortedPatients = [...patients].sort((a, b)=>b.score-a.score);
            patients.forEach((patient, index)=>assert.strictEqual(patient.id, sortedPatients[index].id));
        });
    });
});