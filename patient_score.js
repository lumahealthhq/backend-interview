// It seems like math.js provides a lot of useful function when dealing with
// this type of problem. However I will assume we can only use standard libraries
// for this assignment

const path = "./sample-data/patients.json";
const fs = require("fs");
const readline = require('readline');
const weights = {acceptedOffers: 0.3,
				 age: 0.1,
				 distance: 0.1,
				 canceledOffers: 0.3,
				 reply_time: 0.2};


function calculateDistance(patient_location, target_location) {
	/** NOTE: I believe this should be using some sort of package/API to get the location with ease,
	*         but again we are using only standard library, so I'm using a variation of code written
	*         here: https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-in-your-web-apps.html
	
	* both locations consist of 'latitude' and 'longitude'
	* Args:
			patient_location (struct): struct containing "latitude" and "longitude" for patient's location
			target_location (struct): struct containing "latitude" and "longitude", given by getLocation
	* Returns:
			dist (float): distance calculated
	*/		
	var p_lat = Math.PI * parseFloat(patient_location.latitude) / 180;
	var p_lon = Math.PI * parseFloat(patient_location.longitude) / 180;

	var t_lat = Math.PI * parseFloat(target_location.latitude) / 180;
	var t_lon = Math.PI * parseFloat(target_location.longitude) / 180;

	var theta = p_lon - t_lon;
	var dist = Math.sin(p_lat) * Math.sin(t_lat) + Math.cos(p_lat) * Math.cos(t_lat) * Math.cos(theta);
	dist = Math.acos(dist) * 180 / Math.PI * 60 * 1.1515;
	return dist;
}

function classify(value, max, min, num_buckets) {
	/** determine which bucket a given value should fall into given the range
	* for this problem, we devide the range into 10 parts (buckets)
	* args:
	 		value (float): number to determine which bucket to fal into
			max (float): max value of the category
			min (float): min value of the category
			num_buckets (int): number of buckets
	* Returns:
			i (int): the score (classification) for the given value
	*/

	var threshold = (max - min) / num_buckets;
	for (let i=0; i<num_buckets; i++) {
		if (value >= min + threshold * i && value <= min + threshold * (i +1)) {
			return i
		}
	}
	
}

function calculateScore(data, target_location, age_max, age_min, acceptedOffers_max, acceptedOffers_min, canceledOffer_max, canceledOffer_min, averageReplyTime_max, averageReplyTime_min, distance_max, distance_min, sample_limit){
	/** dividing each range into 10 buckets, assign each value into a bucket and return the score accordingly
	*  The score is then weighted based on the given weights and summed
	* Args:
		data (struct): actual patient data being passed in
		target_location (struct): in form of {latitude: <lat>, longitude: <lon>}
		age_max (float): max age
		age_min (float): min age
		acceptedOffers_max (float): max number of accepted offers 
		acceptedOffers_min (float): min number of accepted offers
		canceledOffer_max (float): max number of canceled offers
		canceledOffer_min (float): min number of canceled offers
		averageReplyTime_max (float): max number of average reply time
		averageReplyTime_min (float): min number of average reply time
		distance_max (float): max distance
		distance_min (float): min distance
		sample_limit(float): threshold for randomly assigning patient to have score 10 (put in top of the list)
	* Returns:
		score (float): final score calculated
	*/
	var dist_score = weights.distance * classify(calculateDistance(data.location, target_location), distance_max, distance_min, 10);
	var age_score = weights.age * classify(data.age, age_max, age_min, 10);
	var acceptedOffers_score = weights.acceptedOffers * classify(data.acceptedOffers, acceptedOffers_max, acceptedOffers_min, 10);
	var canceledOffer_score = weights.canceledOffers * classify(data.canceledOffers, canceledOffer_max, canceledOffer_min, 10);
	var averageReplyTime_score =  weights.reply_time * classify(data.averageReplyTime, averageReplyTime_max, averageReplyTime_min, 10);
	if (data.acceptedOffers + data.canceledOffers <= sample_limit) {
		sample_too_small = 1;

	} else {
		sample_too_small = 0;
	}
	// check if sample size is too small
	let score = 0
	if (Math.random() >=0.5 && sample_too_small) {
		score = 10
	} else {
		score = Math.ceil((dist_score + age_score + acceptedOffers_score + canceledOffer_score + averageReplyTime_score))
	}
	return score
}

function main(debug) {
	var debug = typeof debug  !== 'undefined' ? debug : false;
	var data = fs.readFileSync(path, "utf8");
	var json_data = JSON.parse(data);

	var len = json_data.length;
	var canceledOffer_min = 100000000;
	var averageReplyTime_min = 100000000;
	var age_min = 100000000;
	var acceptedOffers_min = 100000000;
	var distance_min = 1000000000;
	var canceledOffer_max = 0;
	var averageReplyTime_max = 0;
	var age_max = 0;
	var acceptedOffers_max = 0;
	var distance_max = 0;
	// get target location from API
	var target_lat = process.argv[2];
	var target_lon = process.argv[3];
	try {
		target_lat = parseFloat(target_lat);
		target_lon = parseFloat(target_lon);
		var target_location = {latitude: target_lat, longitude: target_lon};
		console.log("Target Location: ", target_location)

	} catch (err) {
		console.log("Cannot convert latitude and longitude. Are you passing in numbers?", err);
		return
	}

	for (var row in json_data) {
		// recording max value and min for each required category. This is
		// for deviding each range into 10 parts for scoring
		if (json_data[row].canceledOffers > canceledOffer_max) {
			canceledOffer_max = json_data[row].canceledOffers;
		}
		if (json_data[row].canceledOffers < canceledOffer_min) {
			canceledOffer_min = json_data[row].canceledOffers;
		}

		if (json_data[row].averageReplyTime > averageReplyTime_max) {
			averageReplyTime_max = json_data[row].averageReplyTime;
		}
		if (json_data[row].averageReplyTime < averageReplyTime_min) {
			averageReplyTime_min = json_data[row].averageReplyTime;
		}

		if (json_data[row].acceptedOffers > acceptedOffers_max) {
			acceptedOffers_max = json_data[row].acceptedOffers;
		}
		if (json_data[row].acceptedOffers < acceptedOffers_min) {
			acceptedOffers_min = json_data[row].acceptedOffers;
		}

		if (json_data[row].age > age_max) {
			age_max = json_data[row].age;
		}
		if (json_data[row].age < age_min) {
			age_min = json_data[row].age;
		}

		if (calculateDistance(json_data[row].location, target_location) > distance_max) {
			distance_max = calculateDistance(json_data[row].location, target_location);
		}
		if (calculateDistance(json_data[row].location, target_location) < distance_min) {
			distance_min = calculateDistance(json_data[row].location, target_location);
		}

	}

	// use 10% of total sample as indicator that this patient does not have enough sample, need to
	// randomly by selected to put to top of the list (set score to 10)
	var sample_limit = (acceptedOffers_max + canceledOffer_max) * 0.1;

	// I was thinking of a better way to deal with updating values so I don't have to iterate through the same
	// patients over and over, but if I want to calculate the mean and find max without using a matrix, it seems
	// needed to keep iterating the same json
	var modified_json = [];
	for (let i=0; i<len; i++) {
		modified_json.push({id: json_data[i].id,
							name: json_data[i].name,
							score: calculateScore(json_data[i],
												  target_location,
												  age_max,
												  age_min,
												  acceptedOffers_max,
												  acceptedOffers_min,
												  canceledOffer_max,
												  canceledOffer_min,
												  averageReplyTime_max,
												  averageReplyTime_min,
												  distance_max,
												  distance_min,
												  sample_limit)
							});

	}
	if (! debug) {
		fs.writeFile("output.txt", JSON.stringify(modified_json), "utf8", (err) => {
			if (err) throw err;
			console.log('Write successful.');
		});
	} else {
		return modified_json;
	}
}
///////////////////////////////////
//            Tests             //
/////////////////////////////////

var assert = {
	equal: function(compare, to_compare) {
		if (compare != to_compare) {
			throw new Error(compare, 'does not equal to', to_compare);
		}
	}
};

function test_calculateDistance() {
	var patient_location = {latitude: 123, longitude: 123};
	var target_location = {latitude: 123, longitude: 123};
	var target_location2 = {latitude: 0, longitude: 0};
	try {
		assert.equal(calculateDistance(patient_location, target_location), 0);
		console.log("patient_location and target_location are the same.");
	} catch (error) {
		console.log(error.message);
	}
	try {
		assert.equal(calculateDistance(patient_location, target_location2), 5025.924014847024);
		console.log("patient_location and target_location are the same.");
	} catch (error) {
		console.log(error.message);
	}
}

function test_classify() {
	var min = 0;
	var max = 100;
	var value = 10;
	var value2 = 99;
	var num_buckets = 10;
	try {
		assert.equal(classify(value, max, min, num_buckets), 0);
		console.log("calculated bucket and expected bucket are the same.");
	} catch (error) {
		console.log(error.message);
	}
	try {
		assert.equal(classify(value2, max, min, num_buckets), 9);
		console.log("calculated bucket and expected bucket are the same.");
	} catch (error) {
		console.log(error.message);
	}
	
}

function test_calculateScore() {
	var data = {id:"541d25c9-9500-4265-8967-240f44ecf723",name:"Samir Pacocha",location:{latitude:"46.7110",longitude:"-63.1150"},age:46,acceptedOffers:49,canceledOffers:92,averageReplyTime:2598};
	var data2 = {id:"b483afb8-2ed7-4fd2-9cd6-c1fd7071f19f",name:"Mathew Halvorson",location:{latitude:"-75.6334",longitude:"-165.8910"},age:26,acceptedOffers:80,canceledOffers:22,averageReplyTime:2315};
	var target_location = {latitude: 123, longitude: 123};
	var age_max = 90;
	var age_min = 15;
	var acceptedOffers_max = 100;
	var accpetedOffers_min = 10;
	var canceledOffer_max = 100;
	var canceledOffer_min = 10;
	var averageReplyTime_max = 5000;
	var averageReplyTime_min = 100;
	var distance_max = 100000;
	var distance_min = 100;
	var sample_limit = (acceptedOffers_max + canceledOffer_max) * 0.1;

	try {
		assert.equal(calculateScore(data,
			                        target_location,
			                        age_max,
			                        age_min,
			                        acceptedOffers_max,
			                        accpetedOffers_min,
			                        canceledOffer_max,
			                        canceledOffer_min,
			                        averageReplyTime_max,
			                        averageReplyTime_min,
			                        distance_max,
			                        distance_min,
			                        sample_limit), 6);
		console.log("calculated score and expected score are the same.");
	} catch (error) {
		console.log(error.message);
	}

	try {
		assert.equal(calculateScore(data2,
			 						target_location,
			 						age_max,
			 						age_min,
			 						acceptedOffers_max,
			 						accpetedOffers_min,
			 						canceledOffer_max,
			 						canceledOffer_min,
			 						averageReplyTime_max,
			 						averageReplyTime_min,
			 						distance_max,
			 						distance_min,
			 						sample_limit), 4);
		console.log("calculated score and expected score are the same.");
	} catch (error) {
		console.log(error.message);
	}

}

///////////////////////
//    Execution      //
///////////////////////

if (typeof require != 'undefined' && require.main==module) {
	var mn = main();
	var test_cal = test_calculateDistance();
	var test_classify = test_classify();
	var test_calculateScore = test_calculateScore();
}
