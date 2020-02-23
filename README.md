# WAITING LIST FOR PATIENTS

A smart listing of patients waiting for appointment, based on ordenation of their calculated score.

## Getting Started

Using the GET method for the api's hosting address ("localhost: 8080" in this case), coordinate parameters referring to the facility should be passed in order to obtain an ordered list of 10 patients most likely to accept an medical appointment.

### Prerequisites

Execute NodeJS ("Node app.js"), to have all the dependecies installed (Example: "npm i express"). Be sure to have internet connection to access the stored mysql of this project or have the mysql database hosted in some other server (Needed SQL instructions are stored in "documentation" folder).

```
"dependencies": {
    "express": "^4.17.1",
    "geo-distance": "^0.2.0",
    "mysql": "^2.18.1",
    "request": "^2.88.2"
}
```

## Running the tests

Send a "GET" request to the NodeJS server of the project ("localhost:8080/" in this example), passing parameters of coordinates (latitude, longitude) througth Json body.

```
{"lat": 23.8162, "lon":-95.4601}
```

Tools like Insomina, Postman or even througth a web browser could be used to test. 

Are expeted to return a JSon list of 10 registrated names ordenateds by their score.

## Algorithm resume
* Request server, passing coordinates as Json parameters (those represents the facility location).
* System validate JSon body (lat and lon are mandatory).
* System run a instruction to randonly give a chance to low score patients be on top of the list (30%).
* System connects to MySql database repassing coordinates
* In the sql query there is a additional line that add 1 point to the score, case of patient be near 10Km.
* System return Json list of first 10 pacients 

## About the structure

This system was builted over MVC architecture (Model, View, Control). Througth the "express" library was possible simplify routines of request inputs and outputs answeres. 

The biggest detail would be the fact of data be hosted in a cloud Mysql server and not in a Json File as originaly expected. The reasons are: 
```
1- The great dificulty of NodeJS (and other Javascript based languages) for ordening Json lists. Would be necessary a large detachment of time typing routines to organize data, creating a large quantity of dirty code.

2- I had no much time and there was not a rule forbiding to use SQL based application :D

3- The Code is more clean, focused on necessary and more human to understand.
```

## About random code

Was used a set of two routines (That I hope to be self-explained): 
```
//random number to bring 3 less than 6 score patients to top of list
//in the query, the var "less_score" is a where clause, to bring 3 rows with score below than "less_score" var.
let less_score = Math.floor(Math.random() * 6);



//We got 2 formed sql queries. One is the normal, what brings only the top scored patients
//The second query bring 3 low score patients to top of the list and more 7 normal top scoreds
//Below, the random chance for second query to be the chosed one 
let sql = query1
let val = Math.floor(Math.random() * 100);            
if (val > 69)  sql = query2   //30% chance for 3 less then 6 score patients
```

## About the SCORE

Througth of the test requirements, was used the following criteria:

Demographic

- age  (weighted 10%)
- distance to practice (weighted 10%)

Behavior

- number of accepted offers (weighted 30%)
- number of cancelled offers (weighted 30%)
- reply time (how long it took for patients to reply) (weighted 20%) 


I have created a MySql event (timed function) that update each row with score = null, and it runs each 5 seconds.
```
-- Score is calculate for an event on mysql called "tm_score_patients"
-- Event is set to operate each 5 secs a change avery row with score = null

BEGIN
	-- limits to calculate score 
	SET @age = 60;					-- more than x 1 pt
	SET @acceptedOffers = 0;		-- more than x get 3 pts
	SET @canceledOffers = 0;		-- less than x get 3 pts
	SET @averageReplyTime = 600;	-- less than x get 2 pts | given in sec | 600=10 min

	update tbl_patients set score = (
		if (age >= @age, 1, 0) +
		if (acceptedOffers > @acceptedOffers, 3, 0) +
		if (canceledOffers > @canceledOffers, 0, 3) +	
		if (averageReplyTime < @averageReplyTime, 2, 0)
	)where score is null or score = '';
END
```

## About distance calculumn

I have created a Mysql Function, named getDistance, that is called on the query requests. This is responsable for bring the result of distance calculated between patients coordinates and facilty coordinates.

The distance is returned in Kilometes.
```
-- mYSQL function, 
-- returns distance in kilometers between coordinates past and coordinates from row
-- parameters to send: latitude, longitude (facility references)
-- call: getDistance(lat_field_name,long_field_name, facility_lat, facility_lon )

CREATE DEFINER=`lumahealth`@`%` FUNCTION `getDistance`(`lat1` FLOAT, `lng1` FLOAT, `lat2` FLOAT, `lng2` FLOAT)
	RETURNS int(11)
	LANGUAGE SQL
	NOT DETERMINISTIC
	CONTAINS SQL
	SQL SECURITY DEFINER
	COMMENT ''
BEGIN
	declare distance varchar(10);
	set distance = (
		select (6371 * acos( 
            cos( radians(lat2) ) 
            * cos( radians( lat1 ) ) 
            * cos( radians( lng1 ) - radians(lng2) ) 
            + sin( radians(lat2) ) 
            * sin( radians( lat1 ) )
    	)) as distance
	); 

if(distance is null) then 
	return '';
else 
	return distance;
end if;
END
```


## Authors

* **Andre de Souza Medeiros Leal** - *Systems analyst* - [Github](https://github.com/andremedeirosleal)
* See also my profile on [Linkedin](https://github.com/your/project/contributors) 

## License

This project is licensed under the MIT License.
