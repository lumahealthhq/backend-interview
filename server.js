var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var port = process.env.PORT || 3000;
app.use(bodyParser.json());
require('./api/routes.js')(app); //routes.js handles all the requests
app.listen(port);
console.log('Patient List API server started on! ' + port);
exports.app = app;
