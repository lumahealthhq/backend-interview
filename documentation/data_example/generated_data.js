let faker = null;

try {
	faker = require('faker');
} catch(e) {
    console.error("faker module required. please run: npm i faker");
    process.exit(e.code);
}

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " <number of patients>");
    process.exit(-1);
}
 
const numberOfPatients = process.argv[2];

const patients = [];
let i=0;

while (i < numberOfPatients) {
	i++;
	patients.push({
		id:  faker.random.uuid(),
	    name: faker.name.findName(),
	    location: {
	    	latitude : faker.address.latitude(),
	    	longitude : faker.address.longitude()
	    },
	    age : faker.random.number({min:21, max:90}),
	    acceptedOffers : faker.random.number({min:0, max:100}),
	    canceledOffers : faker.random.number({min:0, max:100}),
	    averageReplyTime : faker.random.number({min:1, max:3600}),
	});
}
console.log(JSON.stringify(patients));