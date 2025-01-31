const express = require("express");
const path = require("path");
const { BigQuery } = require("@google-cloud/bigquery");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Sett opp BigQuery-klienten
const bigquery = new BigQuery({
	keyFilename: path.resolve(
		__dirname,
		process.env.GOOGLE_APPLICATION_CREDENTIALS,
	),
});

app.use(express.static(path.join(__dirname, "public")));

// Hjelpefunksjon for å hente data fra BigQuery
async function hentFraBigQuery(options) {
	try {
		// Utfør spørringen
		const [rows] = await bigquery.query(options);
		return rows;
	} catch (error) {
		console.error("Error querying BigQuery (printes denne noensinne?):", error);
		throw error;
	}
}


// Rute for å servere HTML-filen
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/linje/:linjenummer", async (req, res) => {
	const linjen = req.params.linjenummer;
	console.log(linjen);
	const query = `SELECT lineRef, stopPointRef,stopPointName aimedDepartureTime, departureTime, aimedArrivalTime, arrivalTime, dayOfTheWeek FROM  \`ent-data-sharing-ext-prd.realtime_siri_et.realtime_siri_et_last_recorded\` WHERE dataSource = "SKY" AND operatingDate = "2025-01-13" AND lineRef = @lineRef ORDER BY aimedDepartureTime, lineRef LIMIT 1000;`;
	const options = {
		query: query,
		params: {lineRef :"SKY:Line:"+linjen},
		location: "EU", // Juster region om nødvendig
	};
	try {
		const rows = await hentFraBigQuery(options);
		res.json(rows);
	} catch (error) {
		res.status(500).send(`Error querying BigQuery: ${error.message}`);
	}
})

app.get("/alleRuter", async (req, res) => {
	try {
		// SQL-spørring til BigQuery
		const query =
			'SELECT lineRef, stopPointRef, stopPointName, aimedDepartureTime, departureTime, aimedArrivalTime, arrivalTime, dayOfTheWeek FROM  `ent-data-sharing-ext-prd.realtime_siri_et.realtime_siri_et_last_recorded` WHERE dataSource = "SKY" AND operatingDate = "2025-01-13" AND lineRef="SKY:Line:3" ORDER BY aimedDepartureTime, lineRef LIMIT 1000;'; // Endre spørringen etter dine behov
		const options = {
			query: query,
			location: "EU", // Juster region om nødvendig
		};

		// Utfør spørringen
		const [rows] = await bigquery.query(options);

		// Send data som JSON til klienten
		res.json(rows);
	} catch (error) {
		console.error("Error querying BigQuery:", error);
		res.status(500).send("Error querying BigQuery");
	}
});

app.get("/skjema", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "skjema.html"));
});

// Mottar forespørselen fra skjemaet
app.post("/query", async (req, res) => {
	res.send("Data mottatt!");
});

// Ruten for å hente data som JSON
app.get("/data", async (req, res) => {
	try {
		// SQL-spørring til BigQuery
		const query =
			'SELECT lineRef, stopPointRef, stopPointName, aimedDepartureTime, departureTime, aimedArrivalTime, arrivalTime, dayOfTheWeek FROM  `ent-data-sharing-ext-prd.realtime_siri_et.realtime_siri_et_last_recorded` WHERE dataSource = "SKY" AND operatingDate = "2025-01-13" AND lineRef="SKY:Line:20" ORDER BY aimedDepartureTime, lineRef LIMIT 10;'; // Endre spørringen etter dine behov
		const options = {
			query: query,
			location: "EU", // Juster region om nødvendig
		};

		// Utfør spørringen
		const [rows] = await bigquery.query(options);

		// Send data som JSON til klienten
		res.json(rows);
	} catch (error) {
		console.error("Error querying BigQuery:", error);
		res.status(500).send("Error querying BigQuery");
	}
});

// Start serveren
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
