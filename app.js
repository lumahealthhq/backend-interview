const server = require("./src/server");

const port = process.env.SERVER_PORT || 8000;

// eslint-disable-next-line no-console
server.listen(port, () => console.log(`Listening at: ${port}`));
