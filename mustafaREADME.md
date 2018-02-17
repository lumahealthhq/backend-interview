Full Stack Interview (LUMA HEALTH)

Question link: https://github.com/lumahealthhq/full-stack-interview

For this app, in addition to required functions, I made a very simple front-end UI with AngularJS for convenience.

-----------------------------------

To Run the application:

Make sure you run app.js file first.
- Open Terminal, locate the folder and type "node app.js", leave it running and open the folder containing this readme file on your computer
- Then double click on index.html file


How To Use:

- After opening index.html, you will see 3 input boxes
- Type in your hospital latitude and longitude values.
- Type in the number of patients you would like to genarate.
- Finally Click Submit

https://imgur.com/a/uB2Nt

NOTE: Please type in only numbers on given input boxes, due to lack of time, I did not include validation checks. So, please make sure you type in proper latitude, longitude and number of patients.


RESULTS:

- On the Left Hand side, you will see all the patients genareated and listed in order of their score (from highest to lowest)
- On the right side of the screen, you will see 10 patients who will most likely accept the offer. It may include patients with little data if there are patients who has 85% less information than the average patient in the entire list.
- Those who has less than 85% average data patients will be indicated with true and false on the table
- On the middle column, you will see statistics of the generated patient list.

-----------------------------------------------------------------------


MY APPROACH:

- To calculate an estimate score for each patient, I used given weights
- I took age and Accepted Number of Appointments as positive criteria, since as older people will more likely to have health issues and accept the offer, and patients with more accepted offers are high likely to take following offers, it may indicate an 'ongoing treatment procedure'

- I took distanceToHospital, cancelled offers and avg. reply time as negative indicators as they can affect their decision in a negative manner.

- I took score of 0 (zero) to start with, and then added and substracted given criteria.
At this point, I am aware of the fact that different data can range and affect to score in different ratios. I did a little bit normalizing with converting average reply time from 'seconds' to 'minutes'. However, biggest affecting factor to score is 'distance to hospital'. Since the base location or lat,long zone of the hospital weren't defined, user's input can be anywhere in the world. And since patients are also randomly generated within whole world. I get extreme distances for majority of the patients. However, I double checked with Marcelo about how to normalize this problem and I was told not to worry about it and take is as is, so I did.

Patient With Little Data Criteria
- This part of the question was the most trickiest part to me, I wasn't so clear about "little data" as it may be subjective depending on the given situation. In order to handle that, I considered taking the average of total responses for each patient (accepted+cancelled offers) and look every patient who has 15% or less than than average response number. Up to 3 patients among those who has less than 15% data will be put on top of the main result list which represents 10 patients who will most likely answer. So up to 3 patients with less data and the rest will be based on their score and will be listed on the app.


USAGE:

- You can use this app with its own UI simply by running the app script and opening index.html file
- You can also use it as rest api, simply run the app.js, and provide required object as:
{
patNum: YOUR_VAR,
lat: YOUR_VAR,
long: YOUR_VAR
}

and make a POST call to localhost:3000/run with your parameters, and then the response object will be returned.


---------------------------------------------------------------

Please let me know if you have any questions: mbereke1@binghamton.edu

Mustafa Bereket
