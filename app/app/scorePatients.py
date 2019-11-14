'''
# Luma Technical Interview

## Problem Definition

A busy hospital has a list of patients waiting to see a doctor. 
The waitlist is created sequentially (e.g. patients are added in a fifo order) from the time the patient calls.  
Once there is an availability, the front desk calls each patient to offer the appointment in the order they were added to the waitlist. 
The staff member from the front desk has noticed that she wastes a lot of time trying to find a patient from the waitlist since they're often not available, 
don't pick up the phone, etc.  
She would like to generate a better list that will increase her chances of finding a patient in the first few calls.

## Interview Task

Given patient demographics and behavioral data (see sample-data/patients.json), 
create an algorithm that will process a set of historical patient data and compute 
a score for each patient that (1 as the lowest, 10 as the highest) that represents 
the chance of a patient accepting the offer off the waitlist. Take in consideration that 
patients who have little behavior data should be randomly added to the top list 
as to give them a chance to be selected. 

Expose an api that takes a facility's location as input and returns an ordered list 
of 10 patients who will most likely accept the appointment offer.

## Weighting Categories

Demographic

- age  (weighted 10%)
- distance to practice (weighted 10%)

Behavior

- number of accepted offers (weighted 30%)
- number of cancelled offers (weighted 30%)
- reply time (how long it took for patients to reply) (weighted 20%)

## Patient Model

- ID
- Age (in years)
- location
  - Lat
  - long
- acceptedOffers (integer)
- canceledOffers (integer)
- averageReplyTime (integer, in seconds)

## Deliverables

The code should be written as a Node.js as a library that anyone can import and use. 
It should contain documentation and unit tests that show your understanding of the problem. 
Once you're finished, submit a PR to this repo.
'''

class Patient:
	def __init__(self, patient_id, name, lat, lon, age, acceptedOffers, canceledOffers, averageReplyTime):
		self.patient_id=patient_id
		self.name=name
		self.lat=lat
		self.lon=lon
		self.age=age
		self.acceptedOffers=acceptedOffers
		self.canceledOffers=canceledOffers
		self.averageReplyTime=averageReplyTime
		if age and lat and lon and acceptedOffers and canceledOffers and averageReplyTime:
			self.hasAllInfo = True
		else:
			self.hasAllInfo=False

	def __str__(self):
		return self.name
	def __repr__(self):
		return self.name
	def __lt__(self, other):
		return self.name < other.name
	def __gt__(self, other):
		return self.name > other.name
	def __lt__(self, other):
		return self.name <= other.name
	def __gt__(self, other):
		return self.name >= other.name


import json
import numpy as np 
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from geopy.distance import geodesic
import matplotlib.pyplot as plt
import heapq
from scipy import stats
import random

# Returns Patient Objects
def readFromFile(filename):
	patients = []
	with open(filename) as json_file:
		patient_data = json.load(json_file)
		for patient in patient_data:
			patient_id = patient.get('id')
			name = patient.get('name')
			lat = patient.get('location')['latitude']
			lon = patient.get('location')['longitude']
			age, acceptedOffers, canceledOffers, averageReplyTime = None, None, None, None
			if patient.get('age'):
				age = int(patient.get('age'))
			if patient.get('acceptedOffers'):
				acceptedOffers = int(patient.get('acceptedOffers'))
			if patient.get('canceledOffers'):
				canceledOffers = int(patient.get('canceledOffers'))
			if patient.get('averageReplyTime'):
				averageReplyTime = int(patient.get('averageReplyTime'))
			patients.append(Patient(patient_id, name, lat, lon, age, acceptedOffers, canceledOffers, averageReplyTime))
	return patients

# Contains the trained model and information about all patients
class PatientsClass:
	def __init__(self, patients):
		self.allPatients = patients

		self.model = PatientLinearModel()
		self.model.trainModel(patients)

		self.allAgeScores = []
		self.allAcceptedOffers = []
		self.allCanceledOffers = []
		self.allReplyTimes = []
		for patient in patients:
			if patient.age:
				self.allAgeScores.append(self.model.predict(patient.age))
			if patient.acceptedOffers:
				self.allAcceptedOffers.append(patient.acceptedOffers)
			if patient.canceledOffers:
				self.allCanceledOffers.append(patient.canceledOffers)
			if patient.averageReplyTime:
				self.allReplyTimes.append(patient.averageReplyTime)
			
	def getReplyTimePercentile(self, averageReplyTime):
		return stats.percentileofscore(self.allReplyTimes, averageReplyTime)

	def getAcceptedOffersPercentile(self, acceptedOffers):
		return stats.percentileofscore(self.allAcceptedOffers, acceptedOffers)

	def getCanceledOffersPercentile(self, canceledOffers):
		return stats.percentileofscore(self.allCanceledOffers, canceledOffers)

	def getAgeScorePercentile(self, age):
		return stats.percentileofscore(self.allAgeScores, self.model.predict(age))

	def getTopNPatients(self, n, lat, lon):
		allDistances = []
		# print(lat, lon)
		for patient in self.allPatients:
			distance = getDistance(patient.lat, patient.lon, lat, lon)
			allDistances.append(distance)

		scoredPatients = []
		littleInfoPatients = []
		for i, patient in enumerate(self.allPatients):
			if patient.hasAllInfo:
				score = self.getScore(patient, allDistances[i], allDistances)
				heapq.heappush(scoredPatients, (score, patient))
			else:
				littleInfoPatients.append(patient)
		topPatients = [x[1] for x in heapq.nlargest(n, scoredPatients)]
		if random.random() < .1:
			topPatients[random.randrange(n)] = littleInfoPatients[random.randrange(len(littleInfoPatients))].name
			print('chose a random littleInfoPatient')
		return topPatients

	def getScore(self, patient, distance, allDistances):
		# print(patient.name, self.getDistancePercentile(allDistances, distance)*.1)
		return self.getAgeScorePercentile(patient.age)*.1 + (1-self.getDistancePercentile(allDistances, distance))*.1 + self.getAcceptedOffersPercentile(patient.acceptedOffers)*.3 + (1-self.getCanceledOffersPercentile(patient.canceledOffers))*.3 + (1-self.getReplyTimePercentile(patient.averageReplyTime))*.2

	def getDistancePercentile(self, allDistances, distance):
		return stats.percentileofscore(allDistances, distance)

# Model surrounding patients
class PatientLinearModel:
	model = LinearRegression()
	def __init__(self):
		isTrained = False

	def predict(self, age):
		x = np.array([[age]])
		poly = PolynomialFeatures(2)
		predict_array=np.array(poly.fit_transform(x))
		return self.model.predict(predict_array)

	def trainModel(self, patients):
		# create input and output from patients
		x = []
		y = []
		for i,patient in enumerate(patients):
			x.append([patient.age])
			y.append(self.getModelScore(patient))

		# create degree 2 input
		poly = PolynomialFeatures(2)
		x_transformed = poly.fit_transform(x)

		# train model
		x_np_array = np.array(x_transformed)
		y_np_array = np.array(y)
		self.model.fit(x_np_array, y_np_array)
		self.isTrained = True

	def getModelScore(self, patient):
		# todo maybe change this to something else
		if patient.acceptedOffers and patient.canceledOffers and patient.averageReplyTime:
			return (patient.acceptedOffers/100) - (patient.canceledOffers/100) - (patient.averageReplyTime/3600)
		return 0 

# get distance between lat lon points
def getDistance(lat, lon, dest_lat, dest_lon):
	return geodesic((lat, lon),(dest_lat, dest_lon)).miles

def run(lat, lon):
	patients = readFromFile('app/patient_data/patients.json')
	patientClass = PatientsClass(patients)
	return patientClass.getTopNPatients(10, lat, lon)