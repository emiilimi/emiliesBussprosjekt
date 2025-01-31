const path = require("path");
const { BigQuery } = require("@google-cloud/bigquery");
const fetch = require("node-fetch");
const fs = require('fs');
const { Parser } = require('json2csv');

require("dotenv").config();

const bigquery = new BigQuery({
	keyFilename: path.resolve(
		__dirname,
		process.env.GOOGLE_APPLICATION_CREDENTIALS,
	),
});

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
async function hentData(){
const query =
			'SELECT lineRef, stopPointRef, stopPointName, aimedDepartureTime, departureTime, aimedArrivalTime, arrivalTime, dayOfTheWeek FROM  `ent-data-sharing-ext-prd.realtime_siri_et.realtime_siri_et_last_recorded` WHERE dataSource = "SKY"  AND lineRef="SKY:Line:3" AND stopPointRef="NSR:Quay:53115" AND directionRef="1" ORDER BY aimedDepartureTime, lineRef LIMIT 1000000;'; // Endre spørringen etter dine behov
const options = {
	query: query,
	location: "EU", // Juster region om nødvendig
};

		// Utfør spørringen
const [rows] = await bigquery.query(options);
return(rows)
}

//hentData().then(data => console.log(data)).catch(err => console.error(err));
hentData()
	.then(data => {
		const json2csvParser = new Parser();
		const csv = json2csvParser.parse(data);
		fs.writeFile('output.csv', csv, 'utf8', err => {
			if (err) {
				console.error('Error writing to file', err);
			} else {
				console.log('Data successfully written to file');
			}
		});
	})
	.catch(err => console.error(err));