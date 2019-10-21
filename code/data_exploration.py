import json
import numpy as np
import geopy.distance

def load_data():
	with open("../sample-data/patients.json") as f:
		return json.load(f)

#I know the data is generated randomly so any trends here are just an artifact of the randomness.
#That said, we would expect age to possibly have an impact on acceptance liklyhood in a real world scenario,
#so this is some code I ran to check if there were any easy to notice trends that happened to show up
#in the generated data.  As expected the year to year variance in the ratio of accepted to canceled offers was high, (due to the randomness).
#With the small sample size for each specific age and this artificially high variance, specific ages don't seem like a good predictor with this data.
#I did find however that young patients (under the mean age of 55) had a 2.94 ratio of accepted to
#non-accpeted offers, vs a 2.041 ratio for old patients.  With roughly ~500 patients per category, this
#difference seems worth using for the age portion of our predictions. In real world data we may see a young, old split like this, 
#but more likely we'd use the specific ages, or age buckets, as a predictive feature to an algorithm. 
def evaluate_age_data(data):
	all_years = {}
	young_old = {"young":[], "old":[]}
	avg_age = 0.0
	for p in data:
		if p["age"] not in all_years:
			all_years[p["age"]] = []
		if p["canceledOffers"]  != 0:
			all_years[p["age"]].append(p["acceptedOffers"]/float(p["canceledOffers"]))
			key = "young"
			if p["age"] > 55: #55 chosen after running once to find average age
				key = "old"
			young_old[key].append(p["acceptedOffers"]/float(p["canceledOffers"]))
		avg_age += p["age"]
	print (len(young_old["young"])) #508 young patients
	print (len(young_old["old"])) #483 old patients
	for k in all_years:
		all_years[k] = np.mean(all_years[k])
	for k in young_old:
		young_old[k] = np.mean(young_old[k])
	sorted_age_data = [[k, all_years[k]] for k in all_years]
	sorted_age_data.sort(key = lambda tup: tup[0]) #not enough significance in the all years data to make it a useable metric for acceptance likelyhood (high varience year to year)
	for d in sorted_age_data:
		print (d)
	print ("-----")
	for d in young_old:
		print (d, young_old[d])
	print ("-----")
	print (avg_age/1000) #after running average patient age found to be 55.067 

def evaluate_offer_ratio(data):
	all_years = {}
	young_old = {"young":[], "old":[]}
	avg_ratio = 0.0
	avg_canceled = 0.0
	avg_accepted = 0.0
	count_ratio = 0
	for p in data:
		if p["canceledOffers"]  != 0:
			avg_ratio += p["acceptedOffers"]/p["canceledOffers"] * (p["acceptedOffers"] + p["canceledOffers"])
			print (p["acceptedOffers"]/p["canceledOffers"])
			count_ratio += 1
			avg_accepted += p["acceptedOffers"]
			avg_canceled += p["canceledOffers"]
	print (avg_canceled/count_ratio, "cancel")
	print (avg_accepted/count_ratio, "acccepted")

	print (avg_ratio/count_ratio/(avg_accepted + avg_canceled))
	print (count_ratio)
	print (avg_accepted/avg_canceled)

if __name__ == "__main__":
	patient_data = load_data()
	print (len(patient_data))
	print (len(patient_data[0]))
	print (patient_data[0])
	for p in patient_data:
		if len(p) != 7:
			print (p)
	#evaluate_age_data(patient_data)
	evaluate_offer_ratio(patient_data)