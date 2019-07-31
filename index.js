const express = require('express');
const bodyParser = require('body-parser');
const {trainModel} = require("./data/linearRegression");
const {getListOfScoredPatients} = require("./methods/patients");
const PORT = 7000;


let app = express();

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));


app.get('', (req, res) => {
    res.status(200).send('Welcome to API');
});

app.get('/scoredPatients', getListOfScoredPatients);

/**
 * The model to be trained is the most important thing before start the API, if model can't be trained,
 * then API will not start
 */
if (trainModel()) {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`))
} else {
    console.log('COULD NOT TRAIN MODEL, API IS NOT STARTING')
}

