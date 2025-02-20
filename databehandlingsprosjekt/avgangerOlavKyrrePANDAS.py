import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Load the data
df = pd.read_csv("avganger_olavkyrresgate_uke5.csv", header=0)

#remove columns directionRef
df = df.drop(columns=['directionRef'])

##konverterer til datetime
df["departureTime"] = pd.to_datetime(df["departureTime"])
df["arrivalTime"] = pd.to_datetime(df["arrivalTime"])
df["aimedArrivalTime"] = pd.to_datetime(df["aimedArrivalTime"])
df["aimedDepartureTime"] = pd.to_datetime(df["aimedDepartureTime"])
df["operatingDate"] = pd.to_datetime(df["operatingDate"])

print(df.head(5))

## legger til avvik
df["delayArrival"]=df["arrivalTime"]-df["aimedArrivalTime"]
df["delayDeparture"]=df["departureTime"]-df["aimedDepartureTime"]


# df["rutetidUtenDato"] = df.apply(
#     lambda row: row["departureTime"].time() if pd.isnull(row["aimedArrivalTime"]) else row["aimedArrivalTime"].time(), axis=1
# )
df["rutetidUtenDato"] = np.where(
    pd.isnull(df["aimedArrivalTime"]),
    df["aimedDepartureTime"].dt.time,
    df["aimedArrivalTime"].dt.time
)
print(df["rutetidUtenDato"].isnull().sum())
print(np.where(df["rutetidUtenDato"].isnull()))

# print(df.columns)
# print(df.head(5))

sortertEtterLinje = df.groupby("lineRef")
print(sortertEtterLinje["delayArrival"].mean())
print(sortertEtterLinje["delayDeparture"].mean())

#plotting
#dette plottet viser forsinkelse i avgangstidspunktet for hver linje, man kan velge linjer ved å endre if setningen
plt.figure(1, figsize=(10,8))
for name, group in sortertEtterLinje:
    group.sort_values("rutetidUtenDato")
    linje=name.split(":")[2]
    
    if not "E" in linje and (int(linje)==3 ) or linje=="50E":
        times_in_minutes = group["rutetidUtenDato"].apply(lambda t: t.hour * 60 + t.minute + t.second/60)
        #plt.plot(times_in_minutes, group["delayArrival"].dt.total_seconds()/60, label=f"{name}", alpha=0.5),
        plt.scatter(times_in_minutes/60, group["delayDeparture"].dt.total_seconds()/60, label=f"{name}", alpha=0.5, marker='x')
        ##plt.scatter(times_in_minutes, group["delayArrival"].dt.total_seconds()/60, label=f"{name}", alpha=0.5)

plt.xlabel("Aimed Deprature Time")
plt.ylabel("Delay Departure (minutes)")
plt.grid()
## set x axis to y=0
plt.axhline(0, color='black', lw=1)
plt.legend()
#plt.show()

#dette plottet viser et gjennomsnitt av forsinkelse i avgangstidspunktet for hver linje, altså snittet av fporsinkelsen til avgangen x klokkeslett mandag-fredag
plt.figure(2,figsize=(10,8))
for name, group in sortertEtterLinje:
    group.sort_values("rutetidUtenDato")
    linje = name.split(":")[2]
    
    linjeGruppertetterAvgang = group.groupby("rutetidUtenDato")
    ukesnittSer=linjeGruppertetterAvgang["delayDeparture"].mean()
    ##print(ukesnittSer.index)
    if (not "E" in linje and (int(linje)==15 or int(linje)==12 or int(linje)==3)) or linje=="50E":
        #ukesnittSer.rolling(7).mean().plot(label=f"{name}", alpha=0.5)
        plt.plot(pd.to_datetime(ukesnittSer.index, format='%H:%M:%S'), (ukesnittSer.dt.total_seconds()/60).rolling(15).mean(), label=f"{name}", alpha=0.5)
plt.xlabel("foventet avganstid")
plt.ylabel("Delay Departure (minutes)")
plt.axhline(0, color='black', lw=1)
plt.legend()
plt.show()