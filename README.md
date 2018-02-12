
<H1> List of patients most likely to accept appointment offer </H1>
A busy clinic can have empty slots incase of cancelled appointment by patients. These appointments can be utilized by patients who are in waiting list. This project gives an ordered list of 10 patients who will most likely accept an appointment offer. The application takes help from the historical data.
<Br>
<H4>Prerequisites </H4>
Node v8.9.0
  <H4> Implementation Overview</H4>
The application has two parts. One is a REST API which will handle the request for the clinic and a library which will be finding the list of patients from the historical data. The REST API will take clinic address as input using POST method. The library will take the file name (historical data) and clinic address (latitude and longitude). The library will be reusable, so will be published on npm.
<H4> Implementation Detail of REST API</H4>
<p> The REST API is built on Express framework. It uses app/routes module to handle its request. /p>
<p>
           Request ------- > REST API ---- >  api/routes
</p>
<p> 
1.	The api/routes.js takes the POST request with address of the clinic. </p>
<p>
2.	It then uses geocoder library to convert that address to its geo location (latitude and longitude)
</p>
<p>
3.	It then calls the library toptenpatients to get the patient list</p>

<H4> Implementation Detail of ‘toptenpatients’ Library</H4>
<H2> ‘toptenpatients’ Library Algorithm</H2>
<p> The library returns a Promise Object. This promise object uses other functions. Their functionality has been explained in below statements.
</p>
<p>
1.	Calculate distance of each patient from the clinic with enough behavioral data.
function getDistanceFromClinic()
</p>
2.	Calculate the absolute score of each patient with given weightage. 
function getAbsoulteScore()
</p>
<p>
3.	Stores all patients with less behavior data (cancelledOffer and acceptedOffer ). In this algorithm if patient has both cancelledOffer and acceptedOffer value has less than or equal to 30 (as in this case none of these parameter will even contribute 1%)

</p>
<p>
4.	Find maximum and minimum scores of patients. 
function updateMaxMinValue()
</p> 
5.	Normalize the score between 1 to 10.
function getNormalizedScore()
 </p>
<p>
6.	Randomly select one patient from the list of patients who has less behavioral data. Put it in the top of the result to give them a chance.
function getRandomUser()
</p>
<p>
7.	Sort data of scored patients in increasing order of score. In the code it has been done using Quick sort. So, it will take O(nlog(n)). But, it can be improved to O(nlog(k)) where k is the no of patients and if k is 10 then it will be O(cn) where c = log10. 
function numberSort() {comparator to sort the data} </p>
<p>
8.	Fill the result with scored patients</p>
<p>
9.	Return the result
</p>
<p>

<H4> Test Case </H4>
Test cases are present in both Rest API and Library. They can be found in their respective directory in Test folder. They have been developed using Mocha and Chai framework.
Below are the steps to test.
1.	Get inside rest or library directory
</p>
2.	npm install to install all the dependencies  
</p>
<p>
3.	npm run test (to execute test cases)
</p>

