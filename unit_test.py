import unittest
import json
import os
import math
import requests
from luma_health import app, patient_list_track, distance, sort_patients


class TestFlaskApi(unittest.TestCase):
    def setUp(self):
        """
        Sets up the unit_test application
        """
        tester = app.test_client(self)
        response = tester.get('/api')
        self.assertEqual(response.status_code, 200)

    def test_distance(self):
        """
        Tests if the distance function is working

        """
        tester = app.test_client(self)

        response_d = distance([0, 0], [0, 0])
        response_2 = distance([-733, -415], [-1791.34214134, 6.532342])
        self.assertEqual(response_d, 0)
        self.assertEqual(response_2, 1139.200422879197)

    def test_item_not_exist(self):
        """
        Tests that parts of the api aren't accidently open and we aren't automatically getting 200 reponses in return

        """
        tester = app.test_client(self)
        response_no = tester.get('/5')
        self.assertEqual(response_no.status_code, 404)

    def test_try_online(self):
        """
        Tests that you can run the api via websocket
        """
        tester = app.test_client(self)
        response_online = requests.get(
            'http://127.0.0.1:5000/api?location=1,3')
        self.assertEqual(post_httpbin(response_online).status_code, 200)
        print(response_online.content)
        self.assertEqual(len(response_online.content), 10)

    def test_make_sure_max(self):
        """
        Tests to make sure the list given is the top scorer
        """
        max_score=0
        with open("patients.json") as f:
            e = json.load(f)
            for d in e:

                distance_patient =math.sqrt((1.5 - float(d['location']['latitude']))**2.0 +
                          (63 -float(d['location']['longitude']))**2.0)
                score_calc=d['age'] * .1 + d['acceptedOffers'] * .3 - d[
                    'canceledOffers'] * .3 + d['averageReplyTime'] * .2 + distance_patient * .1
                if max_score<score_calc:
                   max_score=score_calc




        tester = app.test_client(self)
        list = patient_list_track([1.5, 63])
        self.assertEqual(list[-1]['score'], max_score)

    def test_new_patinets(self):
        """
        Tests the app with a new json randomly generated , and lists return the same size
        """
        tester = app.test_client(self)

        cmd = "node generate_data.js 150"
        os.system(cmd)
        response = patient_list_track([1.5, 63])
        response_big = patient_list_track([100, -330])

        self.assertEqual(len(response), 10)
        self.assertEqual(len(response_big), 10)


if __name__ == "__main__":
    unittest.main()
