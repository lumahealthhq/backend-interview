from flask import Flask, request
from flask_restful import Resource, Api
from json import dumps
from flask_api import status
import scoring

app = Flask(__name__)
api = Api(app)


class Top_Patients(Resource):
    def __init__(self, data):
        self.data = data

    # stub function
    def get(self):
        return None

    # takes a post request and expects a latitude and longitude, includes basic error handling
    def post(self):
        if "latitude" not in request.form:
            content = {"error": "Invalid Argument: latitude missing from input"}
            return content, status.HTTP_400_BAD_REQUEST
        if "longitude" not in request.form:
            content = {"error": "Invalid Argument: longitude missing from input"}
            return content, status.HTTP_400_BAD_REQUEST
        try:
            content = scoring.final_score(
                {
                    "latitude": request.form["latitude"],
                    "longitude": request.form["longitude"],
                },
                self.data,
            )
            return content, status.HTTP_200_OK
        except Exception as e:
            return (
                {"error": str(type(e)) + " " + str(e)},
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


if __name__ == "__main__":
    data = scoring.prepare_data()
    api.add_resource(
        Top_Patients, "/patients", resource_class_kwargs={"data": data}
    )  # Route_1
    app.run(port="5002")
