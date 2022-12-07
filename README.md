# FishPredictor

This project is the creation of a tool for predicting the tide and weather for a given location to enable fisherman to plan their trips around favorable conditions.

api data will be accessed from the public NOAA databases. https://api.tidesandcurrents.noaa.gov/api/prod/ and the national weather service api https://api.weather.gov/points/${stationLat},${stationLng}.

user input will start with the state.  A drop down menu will then allow the user to pick the tide station.  Once selected, the tool will pull and display the API data for the selected location for today and the next 7 days.
