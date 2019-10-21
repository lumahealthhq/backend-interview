This file is exists as an overview of the code in this submission, and how to use it.  One note, though the question requested node.js, I chose to code the problem using python, as I was told other languages were acceptable and my node experience is very limited.  I believe python would allow me to create a better presentation.  I am very open to learning and using node.js in the future.

setup - this code has been written to run on python3.  It was specifically written using python 3.7.2  it requires pip installations including:
numpy, geopy, scipy, flask, flask-restful, flask-api, requests, and faker.  The server is configured to use port 5002.  The port can be changed in server.py

scoring.py - this code handles the scoring logic.  It defaults to loading the sample data from "../sample-data/patients.json".  However this is configurable, path can be passed in in server.py or in scorings load_data or prepare_data functions.  The code was written with the assumed context that the historical patient data list may end up very large, and that api calls from different locations would happen much more frequently than updates to historical patient data.  As such it does as much pre-computation as possible before the api call with location is made. And attempts to efficiently score patients based on location using these pre-computed stats.  Patient's scores will be between 1 and 10.

scoring_test.py - unit tests for scoring.py, uses python's built-in library, can be run with "python scoring_test.py"

server.py - creates a server with an endpoint for receiving a hospital location and return list of 10 most likely patients, has basically error handling and status codes. Runs on port 5002 by default

server_test.py - unit tests for server.py, tests mock request to server using testing mode, uses python's built-in library, can be run with "python server_test.py"

factory.py - uses faker to handle data generation for patients and locations for use in unit testing, as well as the sample request file

sample_request.py - example file that demonstrates how to make a post request to the server and get data back, assumes serve is running on port 5002

data_exploration.py - though the data was generated randomly and we can see how it was created, I used this file to simulate approaching the dataset as I would any unknown data.  It has some basic tests, to look for trends in age data and appointment data.  There happened to be a trend in the age data which was used in the scoring code.  This file is not used in the implementation, and has only been left in the code to show a bit of my process.

Code usage:  starting the server by calling server.py will by default start a server on port 5002 which will run and listen to post requests.  Requests expect a dictionary with latitude and longitude floating point fields. ie ({"latitude":14.7157, "longitude":95.2437}) a sample request can be seen in sample_request.py.  Upon a good request the server will return a list of the n (defaults to 10) most likely patient objects.  These objects come from a list that the user should provide as a json input to the server (default path "../sample-data/patients.json") the structure of this data is detailed in readme.md.  If there are less than n patients in the historical list, the server will return the full list ordered based on the most likely patients (with the most likely coming first).  The server will respond with status code 200 on success, 400 on bad request, and 500 on internal error. 


