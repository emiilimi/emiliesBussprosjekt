import pandas
import matplotlib.pyplot as plt
import numpy as np

# Load the data
with open("output.json") as fil:
    df = pandas.read_json(fil)

#remove lines stopPointName
df = df.drop(columns=['stopPointName'])
print(df.head(5))
print(df.columns)
#Print last 5 rows
print(df.tail(5))

#Print the number of rows and columns  
print(df.shape)
print(type(df["aimedArrivalTime"][0]))
#fjerner uheldige dictionaries
df["arrivalTime"] = df["arrivalTime"].apply(lambda x: x["value"] if isinstance(x, dict) else x)
df["aimedArrivalTime"] = df["aimedArrivalTime"].apply(lambda x: x["value"] if isinstance(x, dict) else x)
df["aimedDepartureTime"] = df["aimedDepartureTime"].apply(lambda x: x["value"] if isinstance(x, dict) else x)
df["departureTime"]=df["departureTime"].apply(lambda x: x["value"] if isinstance(x, dict) else x)

##konverterer til datetime
df["arrivalTime"] = pandas.to_datetime(df["arrivalTime"])
df["aimedArrivalTime"] = pandas.to_datetime(df["aimedArrivalTime"])
df["aimedDepartureTime"] = pandas.to_datetime(df["aimedDepartureTime"])
df["departureTime"] = pandas.to_datetime(df["departureTime"])

##legger til avvik
df["arrivalDelay"] = df["arrivalTime"] - df["aimedArrivalTime"]
df["departureDelay"] = df["departureTime"] - df["aimedDepartureTime"]

print(df.head(2))
print(df.tail(2))

##Check for duplicates
print("Duplicates:",df.duplicated().sum())
##Values without departureTime
print("Values without departureTime:",df["departureTime"].isnull().sum())
##Values without arrivalTime
print("Values without arrivalTime:",df["arrivalTime"].isnull().sum())

fjernetAvgang=df[df["departureTime"].notnull()]
ordinæreAvganger=fjernetAvgang[fjernetAvgang["arrivalTime"].notnull()]

# print("Values without departureTime:",ordinæreAvganger["departureTime"].isnull().sum())
# print("Values without arrivalTime:",ordinæreAvganger["arrivalTime"].isnull().sum())
print(ordinæreAvganger.shape)
print(ordinæreAvganger.columns)
print(ordinæreAvganger["departureDelay"].mean())
# Calculate the average departure delay in minutes and seconds
average_departure_delay = ordinæreAvganger["departureDelay"].mean()
average_departure_delay_minutes = average_departure_delay.total_seconds() / 60
print(f"Average departure delay: {average_departure_delay_minutes:.2f} minutes")

# Calculate the average arrival delay in minutes and seconds
average_arrival_delay = ordinæreAvganger["arrivalDelay"].mean()
average_arrival_delay_minutes = average_arrival_delay.total_seconds() / 60
print(f"Average arrival delay: {average_arrival_delay_minutes:.2f} minutes")