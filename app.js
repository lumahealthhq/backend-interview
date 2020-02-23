const express = require('express')
const app = express()
const main_route = require(__dirname + '/routes/main_route.js')

app.use(main_route)

if (module === require.main) {  
    const server = app.listen(process.env.PORT || 8080, () => {
      const port = server.address().port;
      console.log(`App listening on port ${port}`);
    });
}
module.exports = app