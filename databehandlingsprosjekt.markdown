# Dokumentasjon for datasett

## Om løysingsforslaga
- `4eren.ipynb` Her ser jeg på 4-erens forsinkelser langs ruten sin. 
- 
- `tips.py` er ein Python-fil som løyser (mykje) dei same oppgåvene som `tips.ipynb`, men her blir "standardverktøya" frå Python brukt. Dette blir med andre ord mykje meir manuelle operasjonar enn i `tips.ipynb`. Argumentasjonen for å kunne gjere dette er å forstå kva som ligg bak "magien" i Pandas, og du får vist grunnleggjande Python- og programmeringskunnskapar.

## Offisiell lenke til dokumentasjon

[ata.entur.no/domain/public-transport-data/product/realtime_siri_et/urn:li:container:1d391ef93913233c516cbadfb190dc65](ata.entur.no/domain/public-transport-data/product/realtime_siri_et/urn:li:container:1d391ef93913233c516cbadfb190dc65)

Jeg har hentet data fra BigQuery, ved hjelp av filen hentedataCSV.js, og endret queryen utifra hva jeg vil analysere
Mine CSV filer: 
avganger_haukeland_uke5.csv - alle avganger fra haukeland sykehus nord (platform c eller d), i uke 5 (man-søn), alle linjer
avganger_olavkyrresgate_uke5.csv


## Informasjon om dei ulike kolonnene i datasettet
Det meste står i skjema i dokumentasjonen, har også laget min egen tabell (fra 4.eren.ipynb)
| begrep   | forklaring |
| -------- | ---------- |
| lineRef  | referanse til linjen, syntaks "SKY:Line:{linjenummer}"|
| stopPointRef | referanse til stopp. Refererer til konkret platform (eks Fyllingsdalen terminal C). syntaks "NSR:Quay:{idnummer}". Kan søkes opp på https://stoppested.entur.org/ , ligger også i filen stops.txt (som jeg lastet ned fra entur ennellerannen gang for lenge siden) |
| serviceJourneyId   |  id tilknyttet bussavgang. syntaks: {langt tall1}-{langt tall2}, der tall2 er likt for hele linjen. id vil være lik for hver bussavgang (altså f.eks 7.30 avgangen hverdager, men ikke nødvendigvis 7.30 lørdag. Har ikke 100% oversikt her)   |
|aimedDepartureTime| rutetabellbestemt avgangstid til gitt stopp. syntaks: datetimeobj (?),2025-01-27 14:11:00+00:00. Nullobj: NaT |
|departureTime| faktisk avgangstid fra det stoppet|
|aimedArrivalTime| rutetabellbestemt ankomsttid til gitt stopp. syntaks: datetimeobj (?),2025-01-27 14:11:00+00:00. Nullobj: NaT |
|arrivalTime| faktisk ankomsttid til det stoppet, syntaks: datetimeobj (?),2025-01-27 14:11:00+00:00. Nullobj: NaT |
|dayOfTheWeek| ukedag, representert med et tall fra 1-7, der 1 er mandag og 7 er søndag|
|operatingDate| hvilken dag bussen kjører på. litt usikker på hvor grensen går for avganger som går over midnatt, omdenne endres underveis i ruten eller gjelder for hele avgangen. Definert som "date of the vehicle journey"|
|directionRef| enten 1 eller 2, (outbound eller inbound)|
|sequenceNr| nr i rekkefølge av stopp, men om de er i riktig rekkefølge er usikkert. undersøk!|
|delayArrival| utregnet avvik ved ankomst, syntaks: samme som tidligere|
|delayDeparture|utregnet avvik ved avgang, syntaks: samme som tidligere|
|ruteTidUtenDato| klokkeslett for avgang (har senere funnet ut at denne går en time for seint), uten dato. For enklere plotting. Syntaks: hh:mm:ss|
|stopName| OBS: Legges til lenger nede i notebooken. Navnet til stoppestedet, hentes fra rutetabellfil stops.txt (hentet fra entur en gang for lenge siden)|

## Eksempel på spørsmål du kan finne ut av:
1) Hvordan kan vi regne ut og plotte forsinkelser? (veldig generelt spørsmål). se avgangerOlavKyrrePANDAS.ipynb, pandas.ipynb
- Når er bussene mest forsinket? plotter grafer for dette i haukelandPandas.ipynb og olavKyrrePANDAS.py. I interaktivt plott i 4eren.ipynb kan man se den samme trenden.
- Hvilke stopp langs en rute er en linje mest forsinket fra (løser dette i 4.eren.ipynb)
2) Hvilke busser er mest forsinket? 
- Hvilken buss er mest forsinket (gjennomsnittlig )fra et gitt stopp? (løser dette i manuell approach og haukeland.ipynb)
-Hvilken buss er mest forsinket i gjennomsnitt?(over hele linjen/i en retning/på et gitt tidspunkt) - har ikke hentet nok data til å kunne svare på dette...



## oversikt?
### 4.eren.ipynb
jobber med 4-er bussen, har hentet alle avgangene i uke 5.
Ser først på datasettet i sin helhet.
Deretter:
Finner de 10 største forsinkelsene
Finner de 10 mest forsinkede avgangene.
 plotter litt forsinkelser over tid utover i ruten (lager artig interaktivt plott)
 finner hvilke stopp som har størst og minst (gjennomsnittlige) forsinkelser

### haukelandPandas.ipynb
Ser på avganger fra haukeland sjukehus nord i uke 5

plotter forsinkelser, gjennomsnittlige forsinkelser - per tid, per linje
 og trender i form av glidene gjennomsnitt (med mer eller mindre suksess)

### olavKyrrePANDAS.py
forløperen til haukelandPandas, her plottes det forsinkelser og glidene gjennomsnitt, for avganger fra olav kyrres gate i uke 5

### manuell_approach.py
ser på avgangene fra haukeland, finner hvilken buss som går oftest, og gjennomsnittlig forsinkelse per linje
