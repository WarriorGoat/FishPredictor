

let allStations = [];
let groupedByState = [];
let NCStations = [];
let stateNames = [];
let stationNames = [];
let stationId = [];
let statesParent = $("select#stateList");
let stationParent = $("select#stationList");
let stationPicked = "";
let stationNumber = 0;
let startDate = "";
let endDate = "";
let startDatePicked = document.querySelector("#startDate");
let endDatePicked = document.querySelector("#endDate");
let submitForm = $("form");
let answerInput = document.querySelector("#finalAnswer");

createStateList()


submitForm.on("submit", (e) => {
    e.preventDefault();
    startDate = document.getElementById("startDate");
    endDate = document.getElementById("endDate");
    console.log(startDate.value);
    console.log(endDate.value);
    console.log(stationNumber)
    console.log(stationPicked)
    // updateStatus()
    // reset();
    })


//Function library
function getStartDate(){
    startDate=startDatePicked.value;
    console.log(startDate);
}


function createStateList(){
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
            statesParent.onchange="console.log('goodbye')"
            statesParent.append(newOption);
    }})
}

function createStationList(){
    let list = document.getElementById("stateList")
    let statePicked = list.options[list.selectedIndex].value;
    stationNames=[];
    stationId = []
    stationParent.empty();
    for (i=0; i<allStations.length; i++){
        if(allStations[i].state===statePicked){
            stationNames.push(allStations[i].name);
            stationId.push(allStations[i].id);
        }
    }console.log(stationNames);
        for (let i = 0; i<stationNames.length; i++){ 
            let newOption = $(`<option value='${stationId[i]}'>${stationNames[i]}</option>`);
            stationParent.append(newOption);
    }}

function getStationInfo(){
    let list2 = document.getElementById("stationList")
    stationPicked = list2.options[list2.selectedIndex].text;
    stationNumber = list2.options[list2.selectedIndex].value;
    console.log(stationPicked);
    console.log(stationNumber);
}

function getTideInfo(){
fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?
begin_date=${startDate}&
end_date=${endDate}&
station=${stationNumber}&
product=predictions&
datum=MLLW&
time_zone=lst_ldt&
interval=hilo&
units=english&
application=WarriorGoatFishingPlanner&
format=json`)
.then(function(response){
    return response.json();
}) 
.then(function(data){
    console.log(data)
})

}