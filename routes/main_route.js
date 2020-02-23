const express = require('express')
const routes = express.Router()
const MainController = require('../controllers/MainController')
routes.use(express.json())

//ROUTE MAIN FOR APP
routes.get('/', function (req, res, next) {
    MainController.root(req, res, next);
})

module.exports = routes;