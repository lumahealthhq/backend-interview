const list = require('../sample-data/patients.json');

function prettyPrintList() {
        console.log(JSON.stringify(list, null, 2));
        console.log(list.length);
}

prettyPrintList();
