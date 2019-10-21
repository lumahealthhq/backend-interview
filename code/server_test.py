from flask_restful import Resource, Api
from flask import Flask, request
import server
import json
import unittest
import factory
import scoring

app = Flask(__name__)
api = Api(app)


class TestServerResponses(unittest.TestCase):
    def setUp(self):
        data = [factory.gen_fake_patient() for x in range(100)]
        accepted_mean, accepted_std, canceled_mean, canceled_std, response_time_mean, response_time_std = scoring.get_data_stats(
            data
        )
        scored_data = scoring.calculate_intrinsic_score(
            data,
            accepted_mean,
            accepted_std,
            canceled_mean,
            canceled_std,
            response_time_mean,
            response_time_std,
        )

        self.app = app.test_client()
        api.add_resource(
            server.Top_Patients,
            "/patients",
            resource_class_kwargs={"data": scored_data},
        )  # Route_1

        self.app.testing = True

    def test_post(self):
        # missing value field = bad
        item = {"longitude": -13}
        response = self.app.post("http://127.0.0.1:5002/patients", data=item)

        self.assertEqual(response.status_code, 400)
        data = json.loads(response.get_data())
        self.assertEqual(
            data, {"error": "Invalid Argument: latitude missing from input"}
        )

        item = {"latitude": -13}
        response = self.app.post("http://127.0.0.1:5002/patients", data=item)

        self.assertEqual(response.status_code, 400)
        data = json.loads(response.get_data())
        self.assertEqual(
            data, {"error": "Invalid Argument: longitude missing from input"}
        )

        item = factory.gen_fake_location()
        response = self.app.post("http://127.0.0.1:5002/patients", data=item)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.get_data())

        self.assertEqual(len(data), 10)
        self.assertTrue(max([r["score"] for r in data]) <= 10)
        self.assertTrue(min([r["score"] for r in data]) >= 1)
        # ensure max element at front of list and min element at end
        self.assertEqual(max([r["score"] for r in data]), data[0]["score"])
        self.assertEqual(min([r["score"] for r in data]), data[-1]["score"])

        item = {
            "latitude": "asdad",
            "longitude": "asdfasd",
        }  # lets pass in giberish and force a server error
        # in practice there should be more hadnling for mal formed inputs like this put lets at least confirm we handle interal errors
        response = self.app.post("http://127.0.0.1:5002/patients", data=item)
        self.assertEqual(response.status_code, 500)
        data = json.loads(response.get_data())
        print(data)

        self.assertTrue("error" in data)


if __name__ == "__main__":
    unittest.main()
