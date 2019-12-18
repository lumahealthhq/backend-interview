import json
import heapq as q
import math
import flask
import statistics
from flask import request, jsonify
app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/api', methods=['GET'])
def get_patients():
    """
    The api route that returns the patients in an ordered list
    Input:
        coordinates(string): two float numbers as strings that get convereted into floats, if wrong input coordinates default to [0,0]
    Returns:
        make_list_to_dict(Dict): A ordered dict /json file of the 9 highest scoring patients with one new patient

    """
    location = [0, 0]
    if 'location' in request.args:
        location_input = (request.args['location'])
        location_input = location_input.split(',')
        if len(location_input) == 2:
            try:
                #tries to convert the list into float, if failed, error is thrown !
                location_input = list(map(float, location_input))
                location = location_input
            except:
                print("Must be numbers passed in")

    list_pat = patient_list_track(location)
    return make_list_to_dict(list_pat)


def distance(location, patient):
    """
    Finds the distance between the patient and the clinic
    Input:
        location( list of floats): The coordinates of the location of the clinic
        patient ( list of floats): The coordinates of the location of the patient
    Returns:
         distance_calc (float): the distance between the two points

    """
    distance_calc = math.sqrt((location[0] - patient[0])**2.0 +
                              (location[1] - patient[1])**2.0)
    return distance_calc


def sort_patients(list_of_patients):
    """
    Sorts the patients by the score given to them via the algorthim
    Input:
        location( list of floats): The coordinates of the location of the clinic
        patient ( list of floats): The coordinates of the location of the patient
    Returns:
         distance_calc (float): the distance between the two points

    """
    list_of_patients = sorted(list_of_patients, key=lambda i: i['score'])
    return list_of_patients


def make_list_to_dict(list_of_patients):
    """
       Makes a list into a dictionary so it can be viewed on a browser/better to send as paylaod
       Input:
           list_of_patients ( list of dicts): A list of a patients with their metadata
       Returns:
            final_dict (Dict): a dictionary of patients where the key ascending is how likely they are to accept

       """

    final_dict = {}

    for k in range(0, len(list_of_patients)):
        final_dict[str(k)] = list_of_patients[k]
    return final_dict


def patient_list_track(location):
    """
       Takes the json file and returns the top 9/10 scorers plus one patient who has had a small amount of cases
       Returns:
            final_list(list): a list of the 10 patients sorted by score .

       """

    offers = []
    q.heapify(offers)  #a priortity queue of low amount of offers
    test_distance_data = [] #a list to keep track of the datasets of distances to the clinic
    with open("patients.json") as f:
        data_load = json.load(f)
        for d in data_load:
            try:
                distance_patient = distance(location, [
                    float(d['location']['latitude']),
                    float(d['location']['longitude'])
                ])
                test_distance_data.append(distance_patient)
                #assumptions age and accepted offers are postivley correlated with showing up so added to score
                #and cancelled offers and average reply times are negatively correlated so subtracted
                d['score'] = d['age'] * .1 + d['acceptedOffers'] * .3 - d[
                    'canceledOffers'] * .3 - d['averageReplyTime'] * .2
                #if you were given a location, add that to the score
                if location != [0, 0]:
                    d['score'] = d['score'] + distance_patient * .1
                # if a location was not given increase everything over a deminator /.9

                else:
                    d['score'] = d['score'] / .9
                if len(offers) < 10:
                    #build out the priority queue with the first ten members
                    q.heappush(
                        offers,
                        (-(d['acceptedOffers'] + d['canceledOffers']), d))
                #if somebody has offers that are two standard deviations below the mean send them down and pop the queue
                elif offers[0][0] < -(
                        d['acceptedOffers'] +
                        d['canceledOffers']) and distance_patient < (
                            statistics.mean(test_distance_data) -
                            2 * statistics.stdev(test_distance_data)):
                    q.heappushpop(
                        offers,
                        (-(d['acceptedOffers'] + d['canceledOffers']), d))
            except:
                #throw this if somebody entered bad json data , will protect the rest
                print("data loaded incorrectly, not correct parameters")
        list_of_patients = sort_patients(data_load)
        #get the big 9 scorers , then add one off the queue
        temp_list = list_of_patients[-9:]
        offer_pop = offers.pop()
        if offer_pop[1] not in temp_list:
            temp_list.append(offer_pop[1])
        final_list = sort_patients(temp_list)
        return final_list


if __name__ == '__main__':
    app.run(debug=True)
