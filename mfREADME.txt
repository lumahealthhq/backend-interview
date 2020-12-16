Matthew Fernandez Luma Health Backed Interview

How to use:
1. Run mfWeightingAlgorithm.py which uses flask to create an api.
2. Go to http://127.0.0.1:5000/results?lat=0.0&lon=0.0
3. Adjust the Latitude and longitude values in the request url to see different results

Unit Tests are found in mfUnit_Test.py

Notes:
Based on the instruction brief I provide patients with a low number of interactions to have a random chance to be put at the top of the list. I implemented this by adding a behavioralDataAmountCutoff variable and behavioralDataChance variable that can be adjusted to set the desired outcome. Those lucky patients are given a score of 10.1, so they are at the top of the list.
