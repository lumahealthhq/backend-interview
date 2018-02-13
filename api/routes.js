/**
* @module {app} / it handles the incoming request from rest api
*/

var NodeGeocoder = require('node-geocoder');
var toptenpatients = require('toptenpatients');
var _ = require('underscore');

module.exports = function(app){
  /**
 * @api {post} /user Request User information
 * @apiParam {address} address of the clinic
 * @apiSuccess {List} List of the pateints.
 */
  app.post('/address',function(req,res){
    var body = req.body;
    var street = body.street;
    var city = body.city;
    if(!_.isString(street)||!_.isString(city)){
      return res.status(400).send('Invaild street or City');
    }
    var options = {
      provider: 'google',
      httpAdapter: 'https',
      apiKey: 'AIzaSyA4Wv3nOzSr6MWz0kfc-NGNuRDPlZm94-M',
      formatter: null
    };
    var geocoder = NodeGeocoder(options);
    geocoder.geocode(street+" "+city, function(err, result) {// get the geo location of the clinic
          if(err){
            console.log('Invalid address');
            res.status(204).send('Invalid address!')
          }
          toptenpatients.getPatientList('patients.json',result[0].latitude,result[0].longitude).then(function(data){ //get the pateints list from library
           res.send(data);
         }).catch(function(error){
           console.log(error);
         });
    });
  });
}
