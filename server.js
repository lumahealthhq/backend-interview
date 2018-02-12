var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

//var getPatients = require('./getPatients.js');
var app = express();
var port = process.env.PORT || 3000;
app.use(bodyParser.json());
require('./api/routes.js')(app);
app.listen(port);
console.log('Patient List API server started on! ' + port);
exports.app = app;
