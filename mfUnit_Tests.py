import unittest
import json
import math
from mfWeightingAlgorithm import app, getDistance, getScoredandSortedList, getPatientScore

class TestWeightingAlgorithmAPI(unittest.TestCase):
    def setUp(self):
        # tests that the app can successfully run
        myTest = app.test_client(self)
        response = myTest.get('/results')
        self.assertEqual(response.status_code, 200)

    def testGetDistance(self):
        #tests the getDistance function to confirm accuracy
        r1 = getDistance([0.0,0.0],[0.0,0.0])
        self.assertEqual(r1,0.0)
        r2 = getDistance([4.0,3.0],[0.0,0.0])
        self.assertEqual(r2,5.0)

    def testGetScoredandSortedList(self):
        #confirms highest score is either 10 or 10.1
        topResult = getScoredandSortedList([0.0,0.0])[0]['score']
        if topResult == 10.0:
            topResult = 10.1
        self.assertEqual(topResult,10.1)

        #confirms the bottom result is 1.0
        bottomResult = getScoredandSortedList([0.0,0.0])[-1]['score']
        self.assertEqual(bottomResult,1.0)

    def testGetPatientScore(self):
        #confirms the patient scoring algorithm is working correctly
        samplePatient =  {"acceptedOffers": 75, "age": 36,"averageReplyTime": 272, "canceledOffers": 3, "distanceToClinic": 61.546863561517085, "id": "15570ee8-522a-4641-8cae-64e72de3dae1", "location": {"latitude": "-60.6299",  "longitude": "160.5845"}, "name": "Treva Rau", "normalizedacceptedOffers": 0.7575757575757576, "normalizedage": 0.21739130434782608, "normalizedaverageReplyTime": 0.06908171861836562, "normalizedcanceledOffers": 0.030612244897959183, "normalizeddistanceToClinic":0.13234964348260764}
        samplePatientResult = getPatientScore(samplePatient,[0,0])
        self.assertEqual(samplePatientResult,  0.21277687616618823)

if __name__ == '__main__':
    unittest.main()
