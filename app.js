const { response } = require("express")

document.addEventListener('DOMContentLoaded', () => {
    fetch('/patients')
    .then(response => response.json())
    .then(data => {
        displayTopPatients(data);
    })
    .catch(error => {
        console.error('Error fetching data: ', error);
    });
});

function displayTopPatients(patients){
    const patientList = document.getElementById('patientList');

    for (let i = 0; i < 10 && i < patients.length; i++){
        const patient = patients[i];
        const listItem = document.createElement('li');
        listItem.textContent = `${patient.name} (Score: ${patient.score.toFixed(2)})`;
        patientList.appendChild(listItem);
    }
}