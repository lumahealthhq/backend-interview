const express = require("express");

const setupMiddlewares = require("./middlewares");

const app = express();

setupMiddlewares(app);

module.exports.app = app;
