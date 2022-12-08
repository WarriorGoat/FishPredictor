

let allStations = [];
let groupedByState = [];
let stateNames = [];
let stationData = []
let stationNames = [];
let stationId = [];
let stationLat = ""
let stationLng = ""
let stationPicked = "";
let stationNumber = 0;
let startDate = "";
let startDate2 = "";
let endDate = "";
let endDate2 = "";
let weather = []
let tides = []
let submitForm = $("form#shortTerm");
let answerInput = document.querySelector("#finalAnswer");

//Call Initial Function to poplulate states list and set to today's date.
createStateList()
setInitalDates()


//User selects state and station then submits the form
submitForm.on("submit", (e) => {
    e.preventDefault();
    startDate2=fixDateFormat(startDate);
    endDate2=fixDateFormat(endDate);
    getTideInfo();
    getWeatherInfo();
    getMoonInfo()
    })


//Function library

function setInitalDates(){
    let date = new Date()
    startDate = date.toJSON().slice(0,10)
    let date2 = date.setDate(date.getDate() + 7)
    endDate = Date(date2)
    endDate = date.toJSON().slice(0,10);
    }


function fixDateFormat(dateStr){
    let i = 0
    let array=[]
    while (i<dateStr.length) {
        if (dateStr[i]=== "-") {
            array.push("")
            }else {
                array.push(dateStr[i]); 
            }i++;
        }return array.join("")
    }

function createStateList(){ //This function extracts the state names from the noaa station list and uses them to populate the state pull down menu
fetch('https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=tidepredictions')
    .then(function(response){
        return response.json();
    }) 
    .then(function(data){
        allStations = data.stations
        for (i=0; i<allStations.length; i++){
            if(!stateNames.includes(allStations[i].state) && allStations[i].state!==""){
                stateNames.push(allStations[i].state);
            }else if (!stateNames.includes("Other")){stateNames.push("Other")}
        }
        stateNames.sort()
        let statesParent = $("select#stateList");
        for (let i = 0; i<stateNames.length; i++){ 
            let newOption = $(`<option value='${stateNames[i]}'>${stateNames[i]}</option>`);
            statesParent.append(newOption);
    }})
}

function createStationList(){ //this function is triggered by selecting a state.  It then extracts all of the stations for that state and uses them to poulate the stations pull down list
    let stationParent = $("select#stationList");
    let list = document.getElementById("stateList")
    let statePicked = list.options[list.selectedIndex].value;
    if (statePicked==="Other"){
        statePicked=""
    }
    stationData = []
    stationParent.empty(); //this clears the pull down list if a different state is picked
    for (i=0; i<allStations.length; i++){
        if(allStations[i].state===statePicked){
            let nextStation = {}
            nextStation.name = allStations[i].name;
            nextStation.id = allStations[i].id;
            nextStation.state = allStations[i].state;
            nextStation.lat = allStations[i].lat;
            nextStation.lng = allStations[i].lng
            stationData.push(nextStation)
        }}
        for (let i = 0; i<stationData.length; i++){ 
            let newOption = $(`<option value='${stationData[i].id}'>${stationData[i].name}</option>`);
            stationParent.append(newOption);
    }}

function getStationInfo(){ //This function is triggered by selecting a station on the pull down menu.  It then extracts the station information for use in retrieving data about that station
    let list2 = document.getElementById("stationList")
    stationPicked = list2.options[list2.selectedIndex].text;
    stationNumber = list2.options[list2.selectedIndex].value;
    for (let i = 0; i<stationData.length; i++){
        if(stationData[i].id==stationNumber){
            stationLat=stationData[i].lat;
            stationLng=stationData[i].lng;
        }}
}


function getTideInfo(){
    fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${startDate2}&end_date=${endDate2}&station=${stationNumber}&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=WarriorGoatFishingPlanner&format=json`)
    .then(function(response){
        return response.json();
    }) 
    .then(function(tideData){
        tides = tideData.predictions;
        $("#tidesParent").empty();
        for (i=0; i<tides.length; i++){
            let tidesParent = $("#tidesParent");
            let newLI = $(`<li class="list-group-item">${tides[i].t} -  Hi or Low?: ${tides[i].type} -  Height: ${tides[i].v}</li>`);
            let newP = $(`<p class="card-text"></p>`);
            tidesParent.append(newLI);
            tidesParent.append(newP);
    }})
}


function getWeatherInfo(){
        fetch(`https://api.weather.gov/points/${stationLat},${stationLng}`)
        .then(function(response){
            if (response.status<300 && response.status>199){
                return response.json();
            }else{
                console.log("Problem with initial weather.gov request");
                alert("We are experiencing problems with weather.gov.  Please refresh the screen and resubmit your request.");
                console.log(error);
                return;}
        })
        .then(function(forecastURL){  
            let url = forecastURL.properties.forecast;
            fetch(url)
            .then(function(response){
                if (response.status<300 && response.status>199){
                    return response.json();
                    }else{
                        console.log("Problem with secondary weather.gov request");
                        alert("We are experiencing problems with weather.gov.  Please refresh the screen and resubmit your request.");
                        console.log(error); 
                        return;}
            })
            .then(function(forecastData){  
                weather = forecastData.properties.periods;
                $("#weatherParent").empty();
                for (let i = 0; i < weather.length; i++) {
                    let weatherParent = $("#weatherParent");
                    let newLI = $(`<li class="list-group-item">${weather[i].name}</li>`);
                    let newP = $(`<p class="card-text">${weather[i].detailedForecast}</p>`);
                    weatherParent.append(newLI);
                    weatherParent.append(newP);
                }
                }) 
        })  
    }
    

//This function pulls forecasts from a different api.  Only the moon phase and sunrise and sunset times are used.
function getMoonInfo(){
    let moonArray = []
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast?locations=${stationLat},${stationLng}&aggregateHours=24&forecastDays=7&includeAstronomy=true&unitGroup=us&shortColumnNames=false&locationMode=array&contentType=json&key=DKN2N5YS24M55P598RJJFP223`)
    .then(function(response){
        return response.json();
    }) 
    .then(function(data){
        let moonData = data.locations[0].values;
        for (let i = 0; i < moonData.length; i++) {
            let moonObject = {};
            moonObject.moonPhase = moonData[i].moonphase;
            moonObject.sunRise = moonData[i].sunrise;
            moonObject.sunSet = moonData[i].sunset;
            moonArray.push(moonObject);
        }
        $("#moonParent").empty();
        for (let i = 0; i < moonArray.length; i++) {
            let moonParent = $("#moonParent"); 
            let sunrise = new Date(moonArray[i].sunRise);
            sunrise = sunrise.toLocaleString();
            let sunset = new Date(moonArray[i].sunSet);
            sunset = sunset.toLocaleString();
            let phase = moonArray[i].moonPhase *100;
            phase = phase.toFixed();
            let newLI = $(`<li class="list-group-item">${sunrise}:Sunrise - ${sunset}:Sunset - Moon Phase will be:  ${phase}% of full.</li>`);
            let newP = $(`<p class="card-text"></p>`);
            moonParent.append(newLI);
            moonParent.append(newP);
    }})
}