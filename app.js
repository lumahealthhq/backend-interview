const server = require("./src/server");

const port = process.env.SERVER_PORT || 8000;

server.listen(port, () => console.log(`Listening at: ${port}`));
