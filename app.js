"use strict";

const express = require("express");

const PORT = process.env.PORT || 3000;
const HOST = "localhost";

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
