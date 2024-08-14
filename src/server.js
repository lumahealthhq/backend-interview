const { app } = require("./main/config/app");

app.listen(3000, () => {
  console.log("App is listening to http://localhost:3000");
});
