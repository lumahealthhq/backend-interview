const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const patientRoutes =require('./routes/patient')
const cors = require('cors');
require('dotenv').config()
const fs = require('fs');
// app
const app = express();
var http = require('http');
var https = require('https');
var production =false;

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

console.log(process.env.DATABASE);//"mongodb://localhost/luma"
app.use(cors());
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('DB Connected'));


app.use('/api', patientRoutes);

const port = 3100 ;

  app.listen(port, function () { console.log('Example app listening on port '+port+'!! Go to https://localhost:'+port+'/')});

