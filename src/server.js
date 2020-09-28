const express = require('express');
const routes = require('./routes/index');

const server = express();

// Main route
server.use('/v1', routes);

const port = process.env.SERVER_PORT || 3000;

server.listen(port, () => console.log(`Server running on port ${port}`));
