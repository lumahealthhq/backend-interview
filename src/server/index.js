const express = require("express");
const router = require("./router");

const server = express();

server.use("/api/v1", router);

module.exports = server;
