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
        samplePatient = {"location":{"latitude":"43.3205","longitude":"-140.8269"},"age":72,"acceptedOffers":87,"canceledOffers":87,"averageReplyTime":2675}
        samplePatientResult = getPatientScore(samplePatient,[0,0])
        self.assertEqual(samplePatientResult, -542.5339341263153)

if __name__ == '__main__':
    unittest.main()
