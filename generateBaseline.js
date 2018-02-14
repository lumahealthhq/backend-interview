/*
This file should be run as a scheduled job or whenever rebasing is needed

input: filepath to patient info 
output: baseline buckets in an object
*/
const readFile = Promise.promisify(require('fs').readFile);

const createBaseline = (filePath) => {
  //calculate the baseline for each of the categories
  const baselineBuckets = {
    age: [21, 35, 45, 55, 65],
    distanceToFacility: [0, 3000, 6000, 9000, 12000], //in m
    numAcceptedOffers: [],
    numCanceledOffers: [],
    avgReplyTime: [],
  };
  //read patient data from file
  return new Promise ((resolve) => {
    resolve(readFile(filePath, 'utf8')
      .then((data) => {
        let patientsData = JSON.parse(data);

        //for each patient, push category value into baseline for that category
        const baseline = {
          numAcceptedOffers: [],
          numCanceledOffers: [],
          avgReplyTime: [],
        }
        for (var patient of patientsData) {
          baseline.numAcceptedOffers.push(patient.acceptedOffers);
          baseline.numCanceledOffers.push(patient.canceledOffers);
          baseline.avgReplyTime.push(patient.averageReplyTime);
        }

        //sort the baseline in asc order
        baseline.numAcceptedOffers.sort((a, b) => {
          //sort results asc
          return a - b;
        });
        baseline.numCanceledOffers.sort((a, b) => {
          //sort results asc
          return a - b;
        });
        baseline.avgReplyTime.sort((a, b) => {
          //sort results asc
          return a - b;
        });

        //creates 10 buckets
        for (var i = 0; i < patientsData.length; i += Math.floor(patientsData.length/10)) {
          baselineBuckets.numAcceptedOffers.push(baseline.numAcceptedOffers[i]);
          baselineBuckets.numCanceledOffers.push(baseline.numCanceledOffers[i]);
          baselineBuckets.avgReplyTime.push(baseline.avgReplyTime[i]);
        }

        return baselineBuckets;
      })
      .catch((error) => {
        console.log('error reading file')
        throw error;
      });
    )
  });
  
}