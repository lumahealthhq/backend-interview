#!/usr/bin/python3
import json
import math
import random
datafile="patients.json"

#https://janakiev.com/blog/gps-points-distance-python/
#this is used to calculate the distance of two GPS coordinate position
def distance(coord1, coord2):
    R = 6372800  # Earth radius in meters
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    
    phi1, phi2 = math.radians(lat1), math.radians(lat2) 
    dphi       = math.radians(lat2 - lat1)
    dlambda    = math.radians(lon2 - lon1)
    
    a = math.sin(dphi/2)**2 + \
        math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2

    return 2*R*math.atan2(math.sqrt(a), math.sqrt(1 - a))

def GetCallListByDiatance(hospital_coord, size):
    try:
        #read json file into data, it is a list of patients
        with open(datafile) as json_file:
            data = json.load(json_file)
 
        #we calculate the distance to hospital for every patient, add a new 'distance' field for dict
        for p in data:
            mycoord=(float(p['location']['latitude']), float(p['location']['longitude']))
            p['distance'] = distance(hospital_coord, mycoord)
        
        #sort this list by its new "distance" field
        data.sort(key=lambda x: x['distance'])
        return data[:size]
    except Exception as e:
        print("Exception:" + str(e))
        return None

#data is in asending order
def score1(data,val):
    score=0.0
    i=0
    while i<len(data):
        score+=1.0
        #check to see if it has reached top
        if val <= data[i+len(data)//10-1]:
            return score
        i+=len(data)//10

#data is in desending order
def score2(data,val):
    score=0.0
    i=0
    while i<len(data):
        score+=1.0
        if val >= data[i+len(data)//10-1]:
            return score
        i+=len(data)//10


def GetCallListByAlgorithm(hospital_coord, size):
    try:
        with open(datafile) as json_file:
            data = json.load(json_file)
        
        #we get the list for score first
        age=[]   
        dist=[]
        accepted=[]
        canceled=[]
        reply=[]
        for p in data:
            age.append(p['age'])

            #we add 'dist' field to avoid the duplicate calculation 
            mycoord=(float(p['location']['latitude']), float(p['location']['longitude']))
            tmp=distance(hospital_coord, mycoord)
            p['dist']=tmp
            dist.append(tmp)

            accepted.append(p['acceptedOffers'])
            canceled.append(p['canceledOffers'])
            reply.append(p['averageReplyTime'])

        #the elder, better!    
        age.sort()

        #the closer, the better
        dist.sort(reverse=True)

        #come more often, the better
        accepted.sort()
        
        #never cancel, better
        canceled.sort(reverse=True)

        #quick repose is good
        reply.sort(reverse=True)

        #add 'score' field for each user
        for p in data:
            age_score=score1(age, p['age'])
            dist_score=score2(dist,p['dist'])
            accept_score=score1(accepted,p['acceptedOffers'])
            cancel_score=score2(canceled, p['canceledOffers'])
            reply_score=score2(reply, p['averageReplyTime'])
            p['score'] = age_score*0.1 + dist_score*0.1+ accept_score*0.3+ cancel_score*0.3+ reply_score*0.2

        #sort list against score    
        data.sort(key=lambda x:x['score'], reverse=True)    
        #we generate last user randomly
        random_user = data[random.randint(size-1, len(data)-1)]
        
        #final data is the last size-1 user plus one random user
        final_data = data[:size-1] + [random_user]
        return final_data
    except Exception as e:
        print("Exception:" + str(e))
        return None
