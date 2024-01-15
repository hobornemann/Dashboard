// ------------------------------------------------------------
// CONTENTS
// ------------------------------------------------------------
/*  - Imports
    - Global Variables
    - DOM Elements
    - Event-Listeners
    - Functions
    - Other code
 */ 


// -------------------------------------------------------------
// IMPORTS
// -------------------------------------------------------------

import axios from 'axios'


let lat = ""
let lon = ""
  //TODO: OBS!!! Skicka inte 


// Detta är en callback-funktion

getLocation();

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  fetchData(lat, lon);
/* console.log("lat", position.coords.latitude);
lat = position.coords.latitude;
console.log("lon", position.coords.longitude);
lon = position.coords.longitude;
 */
}

//const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`





async function fetchData (lat, lon){

  const APIkey = '51faa6f37756f34fb7074772eb5210f0'; 
  //const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`



  try{
    const response = await axios.get(url)
    console.log(response)
  }
  catch(error){
    console.error("Error", error.message)
    //alert
  }
}

/* fetchData()   // läggs in window. ...contentload... */



fetchImages();

async function fetchImages(){

const ACCESS_KEY = "B2ExOK4J43juFpFQzHKSZ4FriOzV4_vTGZX1ESFsPao";
const url = `https://api.unsplash.com/photos/random?client_id=${ACCESS_KEY}`;

console.log("fetchImages-url");
console.log(url);


  try{
    const response = await axios.get(url)
    console.log(response)
  }
  catch(error){
    console.error("Error", error.message)
    //alert
  }
}




// -------------------------------------------------------------
// GLOBAL VARIABLES
// -------------------------------------------------------------

let dashboard;

// -------------------------------------------------------------
// DOM-ELEMENTS
// -------------------------------------------------------------

const bodyContainer = document.querySelector(".body-container");

const mainHeadingElement = document.querySelector(".main-heading");
const webLinksContainer = document.querySelector(".webLinks-container");
const webLinkFavicon = document.querySelector(".webLink-favicon");
const webLinkHeading = document.querySelector(".webLink-heading");
const deleteWebLinkX = document.querySelector(".delete-webLink");
const buttonOpenAddWebLinkForm = document.querySelector(".button-open-add-webLink-form");
const formAddWebLink = document.querySelector(".form-add-webLink");
const buttonAddNewWebLink = document.querySelector(".button-add-new-webLink");
const weatherContainer = document.querySelector(".weather-container");
const notes = document.querySelector(".notes");
const buttonChangeBackground = document.querySelector(".button-change-background");


// -------------------------------------------------------------
// EVENT-LISTENERS
// -------------------------------------------------------------

//TODO: delete or comment out localStorage = null when app has been developed
// TODO: update dashboard with current weather forecasts 
  // TODO: update favicon / FaviconUrl
window.addEventListener("DOMContentLoaded", () => {
  
  // Reset dashboard in localStorage
  //localStorage.setItem("dashboard", null); //TODO: delete or comment out when app has been developed
  let dashboardInLocalStorage = JSON.parse(localStorage.getItem("dashboard"));

  if(dashboardInLocalStorage == null) {
    console.log("dashboardInLocalStorage == null");
    getDefaultDashboardAndStoreInLocalStorage();
  } else{
    dashboard = dashboardInLocalStorage;
  }
  // TODO: update dashboard with current weather forecasts 
  // TODO: update favicon / FaviconUrl
  updateBodyContainerStepByStep();
  getAndDisplayDateAndTime();  
  setInterval(getAndDisplayDateAndTime, 30000);
});

mainHeadingElement.addEventListener("input", () => {
  dashboard.mainHeading = mainHeadingElement.textContent;
  localStorage.setItem("dashboard", JSON.stringify(dashboard));
  console.log(JSON.parse(localStorage.getItem("dashboard")));
})

buttonOpenAddWebLinkForm.addEventListener("click", () =>{
  formAddWebLink.classList.remove("hidden");
})

deleteWebLinkX.addEventListener("click", () =>{
  const webLinkId = this.parentNode.id;
  dashboard = dashboard.webLinks.filter(webLink => webLink.id !== webLinkId);
  localStorage.setItem("dashboard", JSON.stringify(dashboard));
  this.parentNode.parentNode.removeChild(this.parentNode);
})

notes.addEventListener("input", () => {
  dashboard.notes = notes.textContent;
  localStorage.setItem("dashboard", JSON.stringify(dashboard));
})

buttonOpenAddWebLinkForm.addEventListener("click", ()=>{
  formAddWebLink.classList.remove("hidden");
})

buttonAddNewWebLink.addEventListener("click", addNewWebLink())

buttonChangeBackground.addEventListener("click", changeBackGroundImage())


// -------------------------------------------------------------
// FUNCTIONS
// -------------------------------------------------------------


// TODO: expand the dashboard object with news-data
function getDefaultDashboardAndStoreInLocalStorage(){
  
  dashboard = {
    date: "2023-12-13",
    time: "14:55",
    mainHeading: "My Dashboard",
    webLinks: [
      { 
        id: 1,
        webLinkFaviconUrl: "/images/default-icon.png",
        webLinkHeading: "Google",
        webLinkUrl: "www.google.se",
      },
    ],
    weatherForecasts: [
      {
        weatherIconUrl: "/images/default-icon.png",
        dayHeading: "Idag",
        temperature: "-4&deg",
        weatherComment: "Sol och moln",       
      },
      {
        weatherIconUrl: "/images/default-icon.png",
        dayHeading: "I morgon",
        temperature: "-1&deg",
        weatherComment: "Sol och klart"        
      },
      {
        weatherIconUrl: "/images/default-icon.png",
        dayHeading: "I övermorgon",
        temperature: "+2&deg",
        weatherComment: "Snö och moln"        
      }
    ],
    news: [

    ],
    notes: "Här kan du skriva dina anteckningar. Anteckningarna sparas automatiskt.",
  }; 

  localStorage.setItem("dashboard", JSON.stringify(dashboard));

};


function updateBodyContainerStepByStep(){

  displayDateAndTime(); 
  displayMainHeading();
  displayWebLinkCards();
  displayWeatherCards();
  displayNotes();
};


function getAndDisplayDateAndTime(){
  getDateAndTime();
  displayDateAndTime();
};

function getDateAndTime(){
  const currentDateTime = new Date(); 
  const time =    ((currentDateTime.getHours() < 10)?"0":"")
                  + currentDateTime.getHours() + ":" 
                  + ((currentDateTime.getMinutes() < 10)?"0":"")  
                  + currentDateTime.getMinutes(); 
                  
  const date =    currentDateTime.getFullYear() + "-"
                  + ((currentDateTime.getMonth() + 1 < 10)?"0":"") 
                  + (currentDateTime.getMonth()+1)  + "-" 
                  + ((currentDateTime.getDate() < 10)?"0":"") 
                  + currentDateTime.getDate(); 
  dashboard.time = time;
  dashboard.date = date;
  localStorage.setItem("dashboard", JSON.stringify(dashboard));
};

function displayDateAndTime(){
  dashboard = JSON.parse(localStorage.getItem("dashboard"));
  const timeElement = document.querySelector(".time");
  const dateElement = document.querySelector(".date");
  timeElement.textContent = dashboard.time;
  dateElement.textContent = dashboard.date;
};

function displayMainHeading(){
  mainHeadingElement.textContent = dashboard.mainHeading;
};

function displayWebLinkCards(){
  let webLinksContainerHtml = "";
  dashboard.webLinks.map(webLink => {
    webLinksContainerHtml = webLinksContainerHtml + 
    `<a href="${webLink.webLinkUrl}" target="_blank">
      <button class="webLink-card small-card" id="${webLink.id}">
        <img class="webLink-favicon" src="${webLink.webLinkFaviconUrl}">
        <div class="webLink-heading">${webLink.webLinkHeading}</div>
        <div class="delete-webLink">x</div>
      </button>
    </a>`;
  });
  webLinksContainer.innerHTML = webLinksContainerHtml;
};


function displayWeatherCards(){
  let weatherContainerHtml = "";
  dashboard.weatherForecasts.map(weatherForecast => {
    weatherContainerHtml = weatherContainerHtml + 
    `<div class="weather-card small-card">
      <img class="weather-icon" src="${weatherForecast.weatherIconUrl}">
      <div class="weather-day-temperature-comment">
        <div class="weather-day-heading">${weatherForecast.dayHeading}</div>
        <div class="weather-temperature-comment">
          <div class="weather-temperature">&nbsp${weatherForecast.temperature}&deg&nbsp</div>
          <div class="weather-comment">&nbsp${weatherForecast.weatherComment}&nbsp</div>
        </div>
      </div>
    </div>  
  `;
  });
  weatherContainer.innerHTML = weatherContainerHtml;
};

function displayNotes(){
  notes.innerHTML = dashboard.notes;
};


// TODO: get favicon and store url in the dashboard object
// TODO: Do I need to call a display function to show the added webLinkButton or will that happen automatically?
function addNewWebLink(){
  // TODO: QUESTION: Why is dashboard not accessible from this function????  
  dashboard = JSON.parse(localStorage.getItem("dashboard"));
  console.log("dashboard in addNewWebLink");
  console.log(dashboard);
  // add new webLink object to the dashboard object
 /*  const newWebLinkId = dashboard.webLinks.reduce((previous, current) => {
    return (previous && previous.id > current.id)? previous.id + 1 : current.id + 1;
  }) */
  const newWebLinkId = Math.max(...dashboard.webLinks.map(webLink => webLink.id))
  console.log ("newWebLinkId")
  console.log (newWebLinkId)
  
  const newWebLinkFaviconUrl = "";  // TODO:  // TODO: get favicon and store url in the dashboard object
  console.log("inputWebLinkUrlElement")
  //console.log(inputWebLinkUrlElement)
  const newWebLinkUrl = document.querySelector("#input-webLink-url").value;

  console.log("newWebLinkUrl")
  console.log(newWebLinkUrl)

  const inputWebLinkHeadingElement = document.querySelector(".input-webLink-heading");
  const newWebLinkHeading = inputWebLinkHeadingElement.value;

    
    console.log("newWebLinkFaviconUrl")  
    console.log(newWebLinkFaviconUrl)  

  dashboard.webLinks.push({
    id: newWebLinkId, 
    webLinkFaviconUrl: newWebLinkFaviconUrl,
    webLinkHeading: newWebLinkHeading,
    webLinkUrl: newWebLinkUrl,
  })

  console.log("dashboard")

  console.log(dashboard)
  // add new webLinkButton to the DOM
  const webLinksContainer = document.querySelector(".webLinks-container");
  let webLinksContainerHtml = webLinksContainer.innerHTML;
  const newWebLinkButtonHtml =  
  `<button class="webLink-card small-card" data-id=${newWebLinkId}>
    <img class="webLink-favicon" src="${newWebLinkFaviconUrl}">
    <div class="webLink-heading">${newWebLinkHeading}</div>
    <div class="delete-webLink">x</div>
  </button>`;
  webLinksContainerHtml = webLinksContainerHtml + newWebLinkButtonHtml;

  webLinksContainer.innerHTML = webLinksContainerHtml;


  // TODO:  Do I need to call a display function to show the added webLinkButton or will that happen automatically?
  formAddWebLink.classList.add("hidden");
};

// TODO: create function
function changeBackGroundImage(){
// TODO:
};




// --------------------------------------------------------------
// OTHER CODE
// --------------------------------------------------------------


//Insert html-markup for news cards and store in localStorage 
/* function displayBodyContainer(){

  console.log("dateTime");
  console.log(dashboard.dateTime);

  let bodyContainerHtml = 
  `<header class="header-container">
    <p class="dateTime">${dashboard.dateTime}</p>
  </header>
  <div class="empty-container1"></div>
  <main class="main-container">
      <h1 class="main-heading" contenteditable="true">${dashboard.mainHeading}</h1>
      <section class="cards-container"> 
        <article class="card">
          <h3 class="card-heading">Snabblänkar</h3>
          <div class="webLinks-container">`;

console.log("B")

dashboard.webLinks.map(webLink => {
  bodyContainerHtml = bodyContainerHtml + 
  `<button class="webLink-card small-card" id="${webLink.id}">
    <img class="webLink-favicon" src="${webLink.webLinkFaviconUrl}">
    <div class="webLink-heading">${webLink.webLinkHeading}</div>
    <div class="delete-webLink">x</div>
  </button>`;
});

console.log("C")

bodyContainerHtml = bodyContainerHtml + 
  `</div>
  <button class="button-open-add-webLink-form button">Ny webblänk</button>
  <form class="form-add-webLink"> 
    <input class="input-webLink-url input" type="text" name="input-webLink-url" id="input-webLink-url" placeholder="Kopiera in webblänken här, tex www.google.se">          
    <input class="input-webLink-heading input" type="text" name="input-webLink-heading" id="input-webLink-heading" placeholder="Skriv namnet på länken här, tex Google"> 
    <input class="button-add-new-webLink button" type="submit" value="OK">
  </form>
</article>
<article class="card">
<h3 class="card-heading">Väder</h3>
<div class="weather-container">`;

console.log("D")

dashboard.weatherForecasts.map(weatherForecast => {
  bodyContainerHtml = bodyContainerHtml + 
  `<div class="weather-card small-card">
  <img class="weather-icon" src="${weatherForecast.weatherIconUrl}">
  <div class="weather-day-temperature-comment">
    <div class="weather-day-heading">${weatherForecast.dayHeading}</div>
    <div class="weather-temperature-comment">
      <div class="weather-temperature">&nbsp${weatherForecast.temperature}&deg&nbsp</div>
      <div class="weather-comment">&nbsp${weatherForecast.weatherComment}&nbsp</div>
    </div>
  </div>
</div>  
`;
});

console.log("E")

bodyContainerHtml = bodyContainerHtml + 
`</article>
<article class="card">
  <h3 class="card-heading">Nyheter</h3>
  <div class="news-container">`;
    
  console.log("F")
//Insert html-markup for news cards and store in localStorage 
  
  bodyContainerHtml = bodyContainerHtml + 
  `</div>  
</article>
<article class="card">
  <h3 class="card-heading">Anteckningar</h3>
  <div class="notes-card small-card">
    <p class="notes" contenteditable="true">${dashboard.notes}</p>  
  </div>
</article>
</section> 
</main>
<div class="empty-container2"></div>
<footer class="footer-container">
<button class="button-change-background button">Byt bakgrundsbild</button>
</footer>
`;

console.log("G")
  bodyContainer.innerHTML = bodyContainerHtml;
  console.log("H")
}; */


/* import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
 */


/* const url = 'https://jsonplaceholder.typicode.com/users'
async function getUser(url) {
  try {
    const response = await axios.get(url);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

getUser(url); */





/* document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
 */