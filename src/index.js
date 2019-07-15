const express = require('express');
const bodyParser = require('body-parser')
const routes = require('./routes/routes')
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api', routes)
app.use((req, res) => {
  res.status(404)
});

app.listen(3000, () =>{
  console.log('App listening on port 3000');
});
