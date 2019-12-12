const app = require('./App');

class Server {
  get port() {
    return process.env.PORT || 3000;
  }

  start() {
    const { port } = this;

    app.listen(port, () => {
      console.log(`Server is running correctly at ${port}`);
    });
  }
}

new Server().start();
