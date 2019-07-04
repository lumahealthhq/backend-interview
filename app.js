/**
 * This starts our server with one route that accepts two parameters
 *
 * This implimentation is very basic for the sake of time.
 * For example: It would make sense to wrap async routes in a middleware func,
 *  to avoid having try/catch in the route.
 */

const express = require("express");
const app = express();
const port = 3000;
const getPatientCallList = require("./src/getPatientCallList.js");

app.get("/getPatientCallList/:lat/:long/:listLength", async (req, res) => {
  try {
    const callList = await getPatientCallList(
      req.params.lat,
      req.params.long,
      req.params.listLength
    );
    // printing the raw JSON to the dom
    console.log("********* Patient Call List ********** \n", callList);
    res.json(callList);
  } catch (error) {
    res.json(error);
  }
});
app.get("/", (req, res) =>
  res.send(
    "Hey Gang, check your console for the route that will return the information you seek! or visit this address: http://localhost:3000/getPatientCallList/37.7904/122.4025/10 "
  )
);
app.listen(port, () =>
  console.log(
    `App listening on port ${port}! \n Please click here to view the patient call list in the browser: http://localhost:3000/getPatientCallList/37.7904/122.4025/10`
  )
);
