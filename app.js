const http = require('http');
const fs = require('fs');
const hostX = 10;
const hostY = 10;
const hostname = '127.0.0.1';
const port = 3000;
function Patients ( ID,  name,   latitude,  longitude, age,  acceptedOffers,  canceledOffers,  averageReplyTime){
  this.id = ID;
  this.name = name;
  this.latitude = latitude; //5
  this.longitude = longitude; // 5
  this.age = age; // (in years) 10
  //randomize
  if(acceptedOffers == null)
  {
    console.log('name: ' + name + ' has no acceptedOffers\n')
    if(!canceledOffers == null)
    {
      this.acceptedOffer = Math.floor(Math.random() * canceledOffers);
    }
    else
    {
       this.acceptedOffer = Math.floor(Math.random() * 11);
     }
  }
  else {  this.acceptedOffers = acceptedOffers; }//30
  if(canceledOffers == null)
  {
    console.log('name: ' + name + ' has no canceledOffers\n')

    if(!acceptedOffers == null)
    {
      this.acceptedOffer = Math.floor(Math.random() * acceptedOffers);
    }
    else {
      this.acceptedOffer = Math.floor(Math.random() * 11);
    }
  }
  else {
    this.canceledOffers = canceledOffers;
   } // 30
  if(averageReplyTime == null)
  {
    console.log('name: ' + name + ' has no averageReplyTime\n')

    this.averageReplyTime = Math.floor(Math.random() * 100000);
  }
  else {
    this.averageReplyTime = averageReplyTime;
  } //in seconds - 20
}


//TAKE INPUT for LOCATION of facility
//REDO lat/long using a^2 + b^2 = c^2
//reassign weight to be 10% of who is closer of a & b


function compareTo (p1, p2) {
   total = 0;
  if(p1.age > p2.age)
  {
    total+= 10;
  }
  else{
    total -= 10;
  }
  var vert1 = hostY - p1.longitude;
  var horz1 = hostX - p1.latitude;
  var c1 = math.sqrt(vert1*vert1 + horz1*horz1);
  var vert2 = hostY - p2.longitude;
  var horz2 = hostX - p2.latitude;
  var c2 = math.sqrt(vert2*vert2 + horz2*horz2);

  if(c1 > c2)
  {
    total += 10;
  }
  else{
    total -= 10;
  }


  if(p1.acceptedOffers > p2.acceptedOffers)
  {
    total += 30;
  }
  else{
    total -= 30;
  }
  if(p1.canceledOffers > p2.canceledOffers)
  {
    total += 30;
  }
  else{
    total -= 30;
  }
  if(p1.averageReplyTime > p2.averageReplyTime)
  {
    total += 20;
  }
  else{
    total -= 20;
  }
  if(total > 0)
  {
    return 1;
  }
  else if (total == 0)
  {
    return 0;
  }
  else{
    return -1;
  }
}


fs.readFile('patients.json', (err, json) => {
  if(err)
  {
     throw err;
  }
  const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/json');
      res.write('original text: \n' + json + '\n');
      var p = JSON.parse(json);
      var paitents_list = [p.length];

      for(i = 0 ; i < p.length; i++)
      {
        var curr = new Patients(p[i].id, p[i].name,  p[i].location.latitude, p[i].location.longitude, p[i].age, p[i].acceptedOffer, p[i].canceledOffers, p[i].averageReplyTime);
        res.write('Name: ' + curr.name + ", lat: " + curr.latitude + ', long: ' + curr.longitude + ', age: ' + curr.age + ', acceptedOffer: ' + curr.acceptedOffer + ', cancelledOffer:' + curr.canceledOffers + ', avgReply:' + curr.averageReplyTime + '\n');
        paitents_list[i] = curr;
      }

      paitents_list.sort();
      res.write('POST SORTED:\n')
      for(i = 0; i < paitents_list.length; i++)
      {
        res.write('Name: ' + paitents_list[i].name + ", lat: " + paitents_list[i].latitude + ', long: ' + paitents_list[i].longitude + ', age: ' + paitents_list[i].age + ', acceptedOffer: ' + paitents_list[i].acceptedOffer + ', cancelledOffer:' + paitents_list[i].canceledOffers + ', avgReply:' + paitents_list[i].averageReplyTime + '\n');

      }


      //document.getElementById("demo").innerHTML = p.id;

      //Prase through the json and put each paitent into paintent array
      //var prev = new paitent
      //loop through json.length
      //var p = json.prase(json);

      //dict_paitnets.push(currRank, p)
      //prev = p
      //dict_paitnet.sort(rank);
      //return top 10 from dict_paitnet

      //now have it displaying .json text
//parse .json -> put all info into the paitents.js (object)
//throw all the paitents.js into an array
//loop through array and sort

      res.end();

  });

  server.listen(port, hostname, () => {
      console.log('Sever started on port ' + port);
  });

});
