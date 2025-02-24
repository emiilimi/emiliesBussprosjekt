import csv
import datetime as dt
#bokens tilnærming



lister=[]
with open("avganger_haukeland_uke5.csv", "r", encoding="utf-8-sig",newline="") as fil:
    filinnhold = csv.reader(fil, delimiter=";")
   
    header=[]
    headers=next(filinnhold)
    for parameter in headers[0].split(","):
        header.append(parameter)
    print(header)

    for parameter in header:
        liste=[]
        lister.append(liste)


    for row in filinnhold:
        rowitems=row[0].split(",")
        i=0
        for item in rowitems:
            lister[i].append(item)
            i+=1
       
        
lineRef=lister[0]
stopPointRef=lister[1]
serviceJourneId=lister[2]
aimedDepartureTime=lister[3]
departureTime=lister[4]
aimedArrivalTime=lister[5]
arrivalTime=lister[6]
dayOfTheWeek=lister[7]
directionRef=lister[8]
sequenceNr=lister[9]

##Finner antall avganger per linje
count_dict={}
for linje in lineRef:
    if linje not in count_dict.keys():
        count_dict[linje]=1
    else:
        count_dict[linje]+=1
print("Antall avganger for hver linje")
for key, value in count_dict.items():
    print(key, value, "avganger")

## Finner gjennomsnittlig avvik per linje
linjer_dict={}
for i in range(len(lineRef)):
    linje=lineRef[i]
    aimed_arrival_str = aimedArrivalTime[i].strip('"') ##må fjerne irriterende anførselstegn
    actual_arrival_str = arrivalTime[i].strip('"')
    aimed_departure_str = aimedDepartureTime[i].strip('"')
    actual_departure_str = departureTime[i].strip('"')
    if aimed_arrival_str and actual_arrival_str and aimed_departure_str and actual_departure_str:  # ajekker at alle verdiene finnes linje 27 forsvinner pga dette. den mangler avgansgtid, da den aldri går fra haukeland nord, men den avslutter ruten sin der. 
        try:
            aimed_arrival = dt.datetime.strptime(aimed_arrival_str, "%Y-%m-%dT%H:%M:%S.%fZ") ##konverterer til datetime, ja det er skikkelig kjedelig
            actual_arrival = dt.datetime.strptime(actual_arrival_str, "%Y-%m-%dT%H:%M:%S.%fZ")
            aimed_departure=dt.datetime.strptime(aimed_departure_str, "%Y-%m-%dT%H:%M:%S.%fZ")
            actual_departure=dt.datetime.strptime(actual_departure_str, "%Y-%m-%dT%H:%M:%S.%fZ")
        except ValueError as e:
            print(f"Error parsing date for index {i}: {e}")
            continue
        linjeArrDelay = actual_arrival - aimed_arrival
        linjeDepDelay = actual_departure - aimed_departure
    
        if linje not in linjer_dict.keys():
            linjer_dict[linje]={"count":1,"delayArrTotal":linjeArrDelay, "delayDepTotal":linjeDepDelay}
        else:
            linjer_dict[linje]["count"]+=1 ##teller antall forekomster
            
            linjer_dict[linje]["delayArrTotal"]+=(linjeArrDelay)##legger til forsinkelse
            linjer_dict[linje]["delayDepTotal"]+=(linjeDepDelay)

print("Gjennomsnittlig forsinkelse per linje:")
for key,value in linjer_dict.items():
    print(f"{key.split(':')[2]:<4}  Ankomst: {value['delayArrTotal']/value['count']}   Avgang:  {value['delayDepTotal']/value['count']}")