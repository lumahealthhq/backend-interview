import json
import math
import random
from flask import Flask, request, jsonify
app = Flask(__name__)
app.config["DEBUG"] = True

@app.route("/results")
def getBestCandidates():
    '''
    Runs the Weighting Algorithm to determine the top 10 candidates for the hospital to reach out

    Parameters:
    None. Location is passed in via the api
    Returns:
    JSON list of the top 10 candidates and their information in ranked order
    '''
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    #error checking that a location is provided
    try:
        facilityLocation = [float(lat),float(lon)]
    except:
        return "ERROR: please provide facility location as lat and lon in valid number format"

    #error checking that the latitude and longitude values are on solid ground (or water)
    if abs(float(lat)) > 90.0:
        return "ERROR: latitude value is not on earth"
    if abs(float(lon)) > 180.0:
        return "ERROR: longitude value is not on earth"

    fullList = getScoredandSortedList(facilityLocation)
    return jsonify(fullList[:10])


def getScoredandSortedList(location):
    '''
    Takes the facility's location and returns the list of all patients in order most likely to be served
    NOTE: behavioralDataAmountCutoff and behavioralDataChance are below and can be adjusted based on desired number of patients who have little behavior data to be added to the top of the list

    Parameters:
    location(list of two floats) - facility location

    Returns:
    sortedPatientData(List of Dicts) - a list of all patients in patients.json ordered by their score as determined by the weighting algorithm
    '''
    with open("patients.json") as jsonData:
        patientData = json.load(jsonData)

        for patient in patientData:
            patientLon = float(patient['location']['longitude'])
            patientLat = float(patient['location']['latitude'])
            distanceToClinic = getDistance([patientLat, patientLon],location)
            patient['distanceToClinic'] = distanceToClinic

        featureScaledPatientData = featureScaling(patientData)

        for patient in featureScaledPatientData:
            patientScore = getPatientScore(patient,location)
            patient['score'] = patientScore
        normalizedPatientData = normalizeScores(patientData)

        behavioralDataAmountCutoff = 20 #number of interactions to quality for bumping to the top of the Line
        behavioralDataChance = .5 #chance to be selected and put on the top of the list

        for patient in normalizedPatientData:
            behavioralScore = patient['acceptedOffers'] + patient['canceledOffers']
            if behavioralScore < behavioralDataAmountCutoff:
                if random.random() <= behavioralDataChance:
                    patient['score'] = 10.1

        #with more time would make a flag for being a behavioral data choice and then update the key function to automatically put those people first
        sortedPatientData = sorted(patientData, reverse = True, key = lambda a: a['score'])

        return sortedPatientData

def featureScaling(patientData):
    '''
    Takes the patient data and and adds features to each patient for their normalized value between 0 and 1.
    This means the weighting algorithm will not be biased by the scale of the input features
    Parameters:
    patientData(List of Dicts) - a list of all patients and their information

    Returns:
    patientData(List of Dicts) - a list of all patients and their information with added key and values for their normalized features.
    '''

    for feature in ['age','distanceToClinic','acceptedOffers','canceledOffers','averageReplyTime']:
        newFeature = 'normalized' + feature
        highValue = -10000.0
        lowValue = 10000.0
        #find the highest and lowest Values
        for patient in patientData:
            currentValue = patient[feature]
            if currentValue > highValue:
                highValue = currentValue
            if currentValue < lowValue:
                lowValue = currentValue

        for patient in patientData:
            currentValue = patient[feature]
            #normalize from 0-1
            newValue = (currentValue - lowValue)/(highValue-lowValue)
            patient[newFeature] = newValue
    return patientData

def getPatientScore(patient,location):
    '''
    Generates a score for a given patient based on their data and the location of the facility being quereied

    Parameters:
    patient(Dict) - Patients information in key-value pairs
    location(List of two floats) - facility location

    Returns:
    score(float) - score represents the likelihood of coming to the clinic based on the weighting algorithm
    '''
    # patientLon = float(patient['location']['longitude'])
    # patientLat = float(patient['location']['latitude'])
    # distanceToClinic = getDistance([patientLat, patientLon],location)
    score = patient['normalizedage']*.1 #postively correlated
    score -= patient['normalizeddistanceToClinic']*.1 #negatively correlated
    score += patient['normalizedacceptedOffers']*.3 #positively correlated
    score -= patient['normalizedcanceledOffers']*.3 #negatively correlated
    score -= patient['normalizedaverageReplyTime']*.2 #negatviely correlated
    return score

def getDistance(patient, clinic):
    '''
    Provides the distance between two locations based on their latitude and longitude

    Parameters:
    patient(list of two floats) - patient location
    clinic(list of two floats) - facility location
    Returns:
    distance(float) - distance between the two locations
    '''
    pLon = float(patient[1])
    pLat = float(patient[0])
    cLat = float(clinic[0])
    cLon = float(clinic[1])
    distance = math.sqrt(((pLon-cLon)**2)+((pLat-cLat)**2))
    return distance

def normalizeScores(patientData):
    '''
    Adjusts the scores for each patient to be normalized 1-10 based on the likelihood to come to the clinic

    Parameters:
    patientData(List of Dicts) - a list of all patients and their information

    Returns:
    patientData(List of Dicts) - a list of all patients with their scores normalized
    '''
    highScore = -10000.0
    lowScore = 10000.0
    #find the highest and lowest scores
    for patient in patientData:
        currentScore = patient['score']
        if currentScore > highScore:
            highScore = currentScore
        if currentScore < lowScore:
            lowScore = currentScore

    for patient in patientData:
        currentScore = patient['score']
        #normalize from 0-1
        newScore = (currentScore - lowScore)/(highScore-lowScore)
        #normalize from 1-10
        newScore = (newScore * 9) +1
        patient['score'] = newScore
    return patientData

# Consider adding more complex weighting if I have time
if __name__ == '__main__':
    app.run(debug=True)
