import json
import numpy as np
import geopy.distance
import scipy.stats as st
import copy
import random

def load_data():
	with open("../sample-data/patients.json") as f:
		return json.load(f)


def get_data_stats(data):
	accepted_mean = np.mean([k["acceptedOffers"] for k in data])
	accepted_std = np.std([k["acceptedOffers"] for k in data])

	canceled_mean = np.mean([k["canceledOffers"] for k in data])
	canceled_std = np.std([k["canceledOffers"] for k in data])

	response_time_mean = np.mean([k["averageReplyTime"] for k in data])
	response_time_std = np.std([k["averageReplyTime"] for k in data])
	return accepted_mean, accepted_std, canceled_mean, canceled_std, response_time_mean, response_time_std



def calculate_intrinsic_score(raw_data, accepted_mean, accepted_std, canceled_mean, canceled_std, response_time_mean, response_time_std):
	data = copy.deepcopy(raw_data)
	age_weight = 1.0
	canceled_weight = 3.0
	accepted_weight = 3.0
	response_time_weight = 2.0
	for x in range(len(data)):
		if data[x]["age"] <= 55:
			data[x]["score"] = age_weight
		else:
			data[x]["score"] = age_weight * 2/2.94 #based this of discovery from data exploration that younger accept more often
			#acknowledging this trend is an artificat of the particular provided sample data, different data would need a different age function
			#real world we'd expect a learned curve, or using age as a feature

		#use zscores and assume normal distribution to caluclate percentile scores, this saves us from searching list repeatedly for true percentiles
		data[x]["score"] += accepted_weight * st.norm.cdf((data[x]["acceptedOffers"] - accepted_mean)/accepted_std)
		data[x]["score"] += canceled_weight * (1 - st.norm.cdf( (data[x]["canceledOffers"] - canceled_mean)/canceled_std) )
		data[x]["score"] += response_time_weight * st.norm.cdf((data[x]["averageReplyTime"] - response_time_mean)/response_time_std)
	return data

def prepare_data():
	patient_data = load_data()
	accepted_mean, accepted_std, canceled_mean, canceled_std, response_time_mean, response_time_std = get_data_stats(patient_data)
	scored_data = calculate_intrinsic_score(patient_data, accepted_mean, accepted_std, canceled_mean, canceled_std, response_time_mean, response_time_std)
	return scored_data

def final_score(hospital_location, scored_data, n = 10):
	data = copy.deepcopy(scored_data)
	distance_weight = 1.0
	best_n = []
	for d in data:
		distance = geopy.distance.geodesic((d["location"]["latitude"], d["location"]["longitude"]), (hospital_location["latitude"], hospital_location["longitude"])).miles
		
		d["score"] += max(distance_weight * (3000-distance)/3000, 0) #the random distances lead to very large distnaces, capping the scoring function at 3000miles otherwise awarding no points
		#in practice we'd want to implement a much more reasonable max distance (say 50 miles) then not consider a candidate if they exceed that, and score based on candidates within the range
		
		#here we'll handle low behavior data patients
		if d["acceptedOffers"] + d["canceledOffers"] < 50 :
			bonus_score = random.uniform(0, 10-d["score"])
			#with a long list this bonus score will make a lot of near 10s which would artifically favor low data pateints, so lets only add the bonus
			#with just this modificaion we'd expect to boost n/(num low behavior patients) patients per request (assume for boosting step n < data length)
			bonus_add_check = random.randint(0, len(data))
			
			#lets also factor in if they get their boost on there ration of acceptedOffers vs cancelledOffers to still punish relatively frequent cancels
			#this means we'll boost actually less than n/(num low behavior patients)
			bonus_cancelation_check = random.randint(-d["canceledOffers"],d["acceptedOffers"])
			if bonus_cancelation_check >= 0 and bonus_add_check <= n:
				d["score"] += bonus_score
				#let's track that we boosted the score
				d["bonus"] = bonus_score
		if d["score"] < 1:
			d["score"] = 1
		d["distance"] = distance
		if len(best_n) < n:
			best_n.append(d)
			best_n.sort(key = lambda obj:obj["score"], reverse = True)
		elif d["score"] > best_n[-1]["score"]:
			best_n[-1] = d
			best_n.sort(key = lambda obj:obj["score"], reverse = True)
	return best_n




if __name__ == "__main__":
	patient_data = load_data()
	accepted_mean, accepted_std, canceled_mean, canceled_std, response_time_mean, response_time_std = get_data_stats(patient_data)
	scored_data = calculate_intrinsic_score(patient_data, accepted_mean, accepted_std, canceled_mean, canceled_std, response_time_mean, response_time_std)
	mock_location = {"latitude":37.77, "longitude":-122.43}	
	mock_location = {"latitude":14.7157, "longitude":95.2437}	
	res = final_score(mock_location, scored_data)
	for r in res:
		print (r)


