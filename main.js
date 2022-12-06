

let allStations = [];
let groupedByState = [];
let stateNames = [];
let stationLat = ""
let stationLng = ""
let stationData = []
let stationNames = [];
let stationId = [];
let statesParent = $("select#stateList");
let stationParent = $("select#stationList");
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

//Call Initial Function to poplulate states list
createStateList()
setInitalDates()


//User selects state and station then submits the form
submitForm.on("submit", (e) => {
    e.preventDefault();
    startDate2=fixDateFormat(startDate);
    endDate2=fixDateFormat(endDate);
    getTideInfo();
    getWeatherInfo();
    })


//Function library
function populateTideData(array){
    // if(array.length>0){
        for (i=0; i<array.length; i++){
            let tidesParent = $("#tidesParent");
            let newLI = $(`<li>Date: ${array[i].t} -  Type: ${array[i].type} -  Height: ${array[i].v}</li>`);
            tidesParent.append(newLI);
        }
        // }else{
        //     alert("We are having trouble with the tide data, please refresh your screen and try again.")
        // }
    }


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
        for (let i = 0; i<stateNames.length; i++){ 
            let newOption = $(`<option value='${stateNames[i]}'>${stateNames[i]}</option>`);
            // statesParent.onchange="console.log('goodbye')"
            statesParent.append(newOption);
    }})
}

function createStationList(){ //this function is triggered by selecting a state.  It then extracts all of the stations for that state and uses them to poulate the stations pull down list
    let list = document.getElementById("stateList")
    let statePicked = list.options[list.selectedIndex].value;
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
    console.log(stationPicked);
    console.log(stationNumber);
    console.log(stationLat,stationLng);
}


function getTideInfo(){
fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${startDate2}&end_date=${endDate2}&station=${stationNumber}&product=predictions&datum=MLLW&time_zone=lst_ldt&interval=hilo&units=english&application=WarriorGoatFishingPlanner&format=json`)
.then(function(response){
    return response.json();
}) 
.then(function(tideData){
    tides = tideData.predictions
})
populateTideData(tides);
}


function getWeatherInfo(){
        fetch(`https://api.weather.gov/points/${stationLat},${stationLng}`)
        .then(function(response){
            if (response.status<300 && response.status>199){
            return response.json();
            }else{
                onsole.log("Problem with initial weather.gov request");
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
                // console.log(weather)
                return weather;}) 
        })  
    displayWeather(weather);  
    }
    

function displayWeather(array){
    for (let i = 0; i < array.length; i++) {
        let weatherParent = $("#weatherParent");
        let newLI = $(`<li font-style='italic'>${array[i].name}</li>`);
        let newP = $(`<p>${array[i].detailedForecast}</p>`)
        weatherParent.append(newLI);
        weatherParent.append(newP);
    }
}
