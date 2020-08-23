const express = require("express");
const router = require("./router");

const server = express();

// Main router.
server.use("/api/v1", router);

module.exports = server;
