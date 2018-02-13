/*
This file should be run as a scheduled job or whenever rebasing is needed

input: filepath to patient info 
output: baseline buckets in an object
*/
var fs = Promise.promisifyAll(require('fs'));

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
    resolve(fs.readFileAsync(filePath, 'utf8')
      .then((data) => {
        let patientsData = JSON.parse(data);
        // console.log(patientsData);
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

        // console.log(`baseline buckets:`);
        // console.log(baselineBuckets.numAcceptedOffers);
        // console.log(baselineBuckets.numCanceledOffers);
        // console.log(baselineBuckets.avgReplyTime)

        return baselineBuckets;
      })
      .catch((error) => {
        console.log('error reading file')
        throw error;
      });
    )
  });
  
}