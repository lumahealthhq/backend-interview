document.addEventListener('DOMContentLoaded', () => {
    fetch('/patients')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (!Array.isArray(data)) {
            throw new Error('Response data is not an array.');
        }

        data.forEach(patient => {
            patient.score = computePatientScore(patient);
        });
        displayTopPatients(data);
    })
    .catch(error => {
        console.error('Error fetching or processing data: ', error);
    });
});

function displayTopPatients(patients){
    const patientList = document.getElementById('patientList');

    for (let i = 0; i < 10 && i < patients.length; i++){
        const patient = patients[i];
        const listItem = document.createElement('li');
        listItem.textContent = `${patient.name} (Score: ${patient.score})`;
        patientList.appendChild(listItem);
    }
}