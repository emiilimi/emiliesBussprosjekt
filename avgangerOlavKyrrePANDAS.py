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


df["rutetidUtenDato"]=df["aimedArrivalTime"].dt.time


print(df.columns)
print(df.head(5))

sortertEtterLinje = df.groupby("lineRef")
print(sortertEtterLinje)
print(sortertEtterLinje["delayArrival"].mean())
print(sortertEtterLinje["delayDeparture"].mean())

import matplotlib.dates as mdates
import matplotlib.ticker as ticker

plt.figure(figsize=(10,5))
for name, group in sortertEtterLinje:
    times_in_minutes = group["rutetidUtenDato"].apply(lambda t: t.hour * 60 + t.minute + t.second/60)
    #plt.plot(times_in_minutes, group["delayArrival"].dt.total_seconds()/60, label=f"{name}")
    plt.scatter(times_in_minutes, group["delayArrival"].dt.total_seconds()/60, label=f"{name}", alpha=0.5)

plt.xlabel("Aimed Arrival Time")
plt.ylabel("Delay Arrival (minutes)")
plt.legend()
plt.show()