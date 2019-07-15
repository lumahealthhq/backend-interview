const moongose = require('mongoose');
const DATABASE = 'mongodb://mongo/luma_health_test'

exports.initializeMongo = function () {
  moongose.connect(DATABASE, {useNewUrlParser: true});
  console.log('Connecting to ' + DATABASE);

  moongose.connection.on('error', () => {console.error('Failed to connect to ' + DATABASE);});

}