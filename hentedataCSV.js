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
const stopPoints = [
	"NSR:Quay:53898",
	"NSR:Quay:53899"
];
const dates=[
	"2025-01-27",
	"2025-01-28",
	"2025-01-29",
	"2025-01-30",
	"2025-01-31",
	"2025-02-01",
	"2025-02-02",
]

async function hentData() {
	const stopPointsQuery = stopPoints.map(sp => `stopPointRef="${sp}"`).join(" OR ");
	const datesQuery = dates.map(d => `operatingDate="${d}"`).join(" OR ");
	const query = `
		SELECT lineRef, stopPointRef, serviceJourneyId, aimedDepartureTime, departureTime, aimedArrivalTime, arrivalTime, dayOfTheWeek, operatingDate, directionRef, sequenceNr
		FROM \`ent-data-sharing-ext-prd.realtime_siri_et.realtime_siri_et_last_recorded\` 
		WHERE dataSource = "SKY" AND (${stopPointsQuery}) AND (${datesQuery})
		ORDER BY operatingDate, aimedDepartureTime 
		LIMIT 100000;
	`;

	const options = {
		query: query,
		location: "EU", // Juster region om nødvendig
	};

	// Utfør spørringen
	const [rows] = await bigquery.query(options);
	return rows;
}

//hentData().then(data => console.log(data)).catch(err => console.error(err));
hentData()
	.then(data => {
		  data = data.map(d => {
					d.aimedDepartureTime = d.aimedDepartureTime ? d.aimedDepartureTime.value : null;
					d.departureTime = d.departureTime ? d.departureTime.value : null;
					d.aimedArrivalTime = d.aimedArrivalTime ? d.aimedArrivalTime.value : null;
					d.arrivalTime = d.arrivalTime ? d.arrivalTime.value : null;
					d.operatingDate = d.operatingDate ? d.operatingDate.value : null;
					return d;
				});
		const json2csvParser = new Parser();
		const csv = json2csvParser.parse(data);
		fs.writeFile('avganger_haukeland_uke5.csv', csv, 'utf8', err => {
			if (err) {
				console.error('Error writing to file', err);
			} else {
				console.log('Data successfully written to file');
			}
		});
	})
	.catch(err => console.error(err));