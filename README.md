### Bruno Cerqueira Solution for Luma Health Interview Test

I started studding ways to automatize the process of scoring, and how to make it effective. 

Started testing a simple scoring algorithm that have a initial score and each attribute and its weight
decreases or increases this score, then transforming it to a scale from 1 to 10 and all good.

But the problems started at performance and accuracy, for every call to get a list of patients, the algorithm would have
to run all the calculations again.

I needed something more accurate and fast, i started looking into Machine Learning solutions, TensorFlow came up. I have
never worked with TensorFlow on Nodejs, only on Python, so i looked on other pull requests to learn some Nodejs TensorFlow
and i enjoyed a lot @dwarthen solution!
## 
### How it works

During the API startup, the training using a dataset of 10.000 patients happens, when this training is ready, the /scoredPatients
is exposed and can be used to return the 9 patients who will most likely accept the appointment offer and 1 patient randomly
chosen between all patients with little behavior data if there are any.

## 
### Startup : 
#### Install dependecies `npm install`
#### Start API with `npm install` its listening on http://localhost:7000

##
### Exemple of request :
##### http://localhost:7000/scoredPatients?lat=10.312043&lon=-40.292301

##
### Known Issues
I'm running on a Windows machine and had to follow this steps to properly install TensorFlow
as it requires Python 2.7 and MS Tools 
1. Open elevated cmd inside project directory
2. `npm install --production windows-build-tools`
3. `npm install @tensorflow/tfjs-node`
4. `npm install @tensorflow/tfjs`
