const us_url = 'https://api.covidtracking.com/v1/us/current.json';
const state_url = 'https://api.covidtracking.com/v1/states/current.json';
const uspop = 328200000;

const statemap = simplemaps_usmap_mapdata.state_specific;

let maploc = document.getElementById('maptemp');

let datatitle = document.getElementById('datatitle');

let dispcases = document.getElementById('cases');
let dispper100k = document.getElementById('per100k');
let dispdeaths = document.getElementById('deaths');
let dispcaseinc = document.getElementById('caseinc');
let dispdeathinc = document.getElementById('deathinc');

let dispupdated = document.getElementById('updated');

let us;
let states;

let uscases;
let uspercap;
let usdeaths;
let uscaseinc;
let usdeathinc;

let cases;
let percap;
let deaths;

let statespercap = {};

let lastupdated = new Date("1999-06-28T00:00:00.000+05:00");

fetch(us_url)
    .then(usObj => usObj.json())
    .then(usData => setUS(usData));

fetch(state_url)
    .then(stateObj => stateObj.json())
    .then(stateData => setState(stateData));

$("#map").on("click", checkClick);

// Funtions

function setUS(json) {

    us = json;
    console.log(us);

    uscases = json[0].positive;
    uspercap = (uscases / uspop) * 100000;
    usdeaths = json[0].death;
    uscaseinc = json[0].positiveIncrease;
    usdeathinc = json[0].deathIncrease;

    dispcases.innerText = uscases.toLocaleString('en');
    dispper100k.innerText = uspercap.toLocaleString('en', {maximumFractionDigits: 0});
    dispdeaths.innerText = usdeaths.toLocaleString('en');
    dispcaseinc.innerText = uscaseinc.toLocaleString('en');
    dispdeathinc.innerText = usdeathinc.toLocaleString('en');

}

function setState(json) {

    states = json;
    console.log(states);
    console.log(statemap);

    for (let st of states){

        let id = st.state;
        let pop = statemap[id].population;

        let temp = ((st.positive) / (pop) * 100000 );

        statespercap[id] = temp;

        switch (true) {
            case (temp > 7500):
                simplemaps_usmap_mapdata.state_specific[id].color = '#ff4848';
                simplemaps_usmap_mapdata.state_specific[id].hover_color = '#921d1d';
                break;
            case (temp > 5000):
                simplemaps_usmap_mapdata.state_specific[id].color = ' #e4e000';
                simplemaps_usmap_mapdata.state_specific[id].hover_color = '#a09e15';
                break;
        }

        let updated = st.lastUpdateEt;
        console.log(updated);
        if(updated != null){
            let month = (updated.substr(0,2));
            let day = (updated.substr(3,2));
            let year = (updated.substr(6,4));
            let hours = (updated.substr(11,2));
            let mins = (updated.substr(14,2));

            updated = new Date(`${year}-${month}-${day}T${hours}:${mins}:00.000-05:00`);
            if(updated > lastupdated) lastupdated = updated;
        }

    }

    dispupdated.innerText = `Data last updated: ${lastupdated}`;

    loadmap();

}

function checkClick(e){

    let check = ($(e.target))[0].classList[0];
    let type = ($(e.target))[0].localName;

    let sel =  $(e.target).text();

    if(sel == "" && check == undefined && type == "path"){
        dispcases.innerText = uscases.toLocaleString('en');
        dispper100k.innerText = uspercap.toLocaleString('en', {maximumFractionDigits: 0});
        dispdeaths.innerText = usdeaths.toLocaleString('en');
        dispcaseinc.innerText = uscaseinc.toLocaleString('en');
        dispdeathinc.innerText = usdeathinc.toLocaleString('en');
        datatitle.innerText = 'United States';
    }
    else if (sel == "" && check != undefined){
        sel = check.slice(-2);
        let temp = states.filter(obj => {
            return obj.state == sel
            
        })
        dispcases.innerText = temp[0].positive.toLocaleString('en');
        dispper100k.innerText = statespercap[sel].toLocaleString('en', {maximumFractionDigits: 0});
        dispdeaths.innerText = temp[0].death.toLocaleString('en');
        dispcaseinc.innerText =temp[0].positiveIncrease.toLocaleString('en');
        dispdeathinc.innerText =temp[0].deathIncrease.toLocaleString('en');
        datatitle.innerText = statemap[sel].name;

    }
    else if (sel != ""){
        let temp = states.filter(obj => {
            return obj.state == sel
            
        })
        dispcases.innerText = temp[0].positive.toLocaleString('en');
        dispper100k.innerText = statespercap[sel].toLocaleString('en', {maximumFractionDigits: 0});
        dispdeaths.innerText = temp[0].death.toLocaleString('en');
        dispcaseinc.innerText =temp[0].positiveIncrease.toLocaleString('en');
        dispdeathinc.innerText =temp[0].deathIncrease.toLocaleString('en');
        datatitle.innerText = statemap[sel].name;
    }
    else{}


}

function loadmap(){

    var head= document.getElementsByTagName('head')[0];
      var script= document.createElement('script');
      script.src= 'js/usmap.js';
      head.appendChild(script);

}

