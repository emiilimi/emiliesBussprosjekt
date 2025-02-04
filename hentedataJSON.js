const path = require("path");
const { BigQuery } = require("@google-cloud/bigquery");
const fetch = require("node-fetch");
const fs = require('fs');

require("dotenv").config();

const bigquery = new BigQuery({
	keyFilename: path.resolve(
		__dirname,
		process.env.GOOGLE_APPLICATION_CREDENTIALS,
	),
});

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const stopPoints = [
	"NSR:Quay:53114",
	"NSR:Quay:53115",
	"NSR:Quay:53118",
	"NSR:Quay:53116",
	"NSR:Quay:53117",
	"NSR:Quay:53119"
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
		SELECT lineRef, stopPointRef, serviceJourneyId, aimedDepartureTime, departureTime, aimedArrivalTime, arrivalTime, dayOfTheWeek 
		FROM \`ent-data-sharing-ext-prd.realtime_siri_et.realtime_siri_et_last_recorded\` 
		WHERE dataSource = "SKY" AND (${stopPointsQuery}) AND (${datesQuery})
		ORDER BY aimedDepartureTime 
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
            return d;
        });
		const json = JSON.stringify(data, null, 2);
		fs.writeFile('avganger_olavkyrresgate_uke5.json', json, 'utf8', err => {
			if (err) {
				console.error('Error writing to file', err);
			} else {
				console.log('Data successfully written to file');
			}
		});
	})
	.catch(err => console.error(err));