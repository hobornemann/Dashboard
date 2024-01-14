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


// -------------------------------------------------------------
// GLOBAL VARIABLES
// -------------------------------------------------------------

let dashboard;

// -------------------------------------------------------------
// DOM-ELEMENTS
// -------------------------------------------------------------

const bodyContainer = document.querySelector(".body-container");
const dateTime = document.querySelector(".dateTime");
const mainHeading = document.querySelector(".main-heading");
const webLinksContainer = document.querySelector(".webLinks-container");
const webLinkFavicon = document.querySelector(".webLink-favicon");
const webLinkHeading = document.querySelector(".webLink-heading");
const deleteWebLinkX = document.querySelector(".delete-webLink");
const buttonOpenAddWebLinkForm = document.querySelector(".button-open-add-webLink-form");
const formAddWebLink = document.querySelector(".form-add-webLink");
const inputWebLinkUrl = document.querySelector(".input-webLink-url");
const inputWebLinkHeading = document.querySelector(".input-webLink-heading");
const buttonAddNewWebLink = document.querySelector(".button-add-new-webLink");
const weatherContainer = document.querySelector(".weather-container");
const notes = document.querySelector(".notes");
const buttonChangeBackground = document.querySelector(".button-change-background");


// -------------------------------------------------------------
// EVENT-LISTENERS
// -------------------------------------------------------------

window.addEventListener("DOMContentLoaded", () => {
  
  let dashboardInLocalStorage = JSON.parse(localStorage.getItem("dashboard"));
  if(dashboardInLocalStorage == null) {
    getDefaultDashboardAndStoreInLocalStorage();
  } else{
    dashboard = dashboardInLocalStorage;
  }
  dashboard.dateTime = getDateTime();
  //loadPage(dashboard) // TODO:  uncomment this line
  //displayCurrentTime();  TODO: activate clock by uncommenting this line
});

mainHeading.addEventListener("input", () => {
  dashboard.mainHeading = mainHeading.textContent;
  localStorage.setItem("dashboard", JSON.stringify(dashboard));
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

buttonChangeBackground.addEventListener("click", changeBackGroundImage())


// -------------------------------------------------------------
// FUNCTIONS
// -------------------------------------------------------------

//TODO: Insert html-markup for news cards and store in localStorage 
function loadPage(dashboard){

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

dashboard.webLinks.map(webLink => {
  bodyContainerHtml = bodyContainerHtml + 
  `<button class="webLink-card small-card" id="${webLink.id}">
    <img class="webLink-favicon" src="${webLink.webLinkFaviconUrl}">
    <div class="webLink-heading">${webLink.webLinkHeading}</div>
    <div class="delete-webLink">x</div>
  </button>`;
});

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

dashboard.weatherForecasts.map(weatherForecast => {
  bodyContainerHtml = bodyContainerHtml + 
  `<div class="weather-card small-card">
  <img class="weather-icon" src="${dashboard.weatherForecast.weatherIconUrl}"/>
  <div class="weather-day-temperature-comment">
    <div class="weather-day-heading">${dashboard.weatherForecast.dayHeading}</div>
    <div class="weather-temperature-comment">
      <div class="weather-temperature">&nbsp;${dashboard.weatherForecast.temperature}&deg;C&nbsp;</div>
      <div class="weather-comment">&nbsp;${dashboard.weatherForecast.weatherComment}&nbsp;</div>
    </div>
  </div>
</div>  
`;
});

bodyContainerHtml = bodyContainerHtml + 
`</article>
<article class="card">
  <h3 class="card-heading">Nyheter</h3>
  <div class="news-container">`;
    
//TODO: Insert html-markup for news cards and store in localStorage 
  
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

  bodyContainer.innerHTML = bodyContainerHtml;
};

// TODO: expand the dashboard object with news-data
function getDefaultDashboardAndStoreInLocalStorage(){
  let dashboard = {
    dateTime: "14:55  2023-12-13",
    mainHeading: "My Dashboard",
    webLinks: [
      { 
        id: 1,
        webLinkFaviconUrl: "",
        webLinkHeading: "Google",
        webLinkUrl: "www.google.se",
      },
    ],
    weatherForecasts: [
      {
        weatherIconUrl: "",
        dayHeading: "Idag",
        temperature: "-4&degr;C",
        weatherComment: "Sol och moln",       
      },
      {
        weatherIcon: "",
        dayHeading: "I morgon",
        temperature: "-1&degr;C",
        weatherDetails: "Sol och klart"        
      },
      {
        weatherIcon: "",
        dayHeading: "I övermorgon",
        temperature: "+2&degr;C",
        weatherDetails: "Snö och moln"        
      }
    ],
    news: [

    ],
    notes: "Här kan du skriva dina anteckningar. Anteckningarna sparas automatiskt.",
  };

  localStorage.setItem("dashboard", JSON.stringify(dashboard));
 
}

function getDateTime(){
  const currentDateTime = new Date(); 
  const dateTime =  + ((currentDateTime.getHours() < 10)?"0":"") 
                  + currentDateTime.getHours() + ":" 
                  + ((currentDateTime.getMinutes() < 10)?"0":"")  
                  + currentDateTime.getMinutes() + "  " 
                  + currentDateTime.getFullYear() + "-"
                  + (currentDateTime.getMonth()+1)  + "-" 
                  + currentDateTime.getDate(); 
  return dateTime;
};

function displayCurrentTime(){
  const currentTime = setTimeout(getDateTime(), 30000);
  dateTime.textContent = currentTime;
  displayCurrentTime();
}

// TODO: get favicon and store url in the dashboard object
// TODO: Do I need to call a display function to show the added webLinkButton or will that happen automatically?
function addNewWebLink(){

  // add new webLink object to the dashboard object
  const newWebLinkId = dashboard.webLinks.reduce((previous, current) => {
    return (previous && previous.id > current.id)? previous.id + 1 : current.id + 1;
  })
  const newWebLinkFaviconUrl = "";  // TODO:  // TODO: get favicon and store url in the dashboard object
  const newWebLinkUrl = inputWebLinkUrl.textContent;
  const newWebLinkHeading = inputWebLinkHeading.textContent;

  dashboard.webLinks.push({
    id: newWebLinkId, 
    webLinkFaviconUrl: newWebLinkFaviconUrl,
    webLinkHeading: newWebLinkHeading,
    webLinkUrl: newWebLinkUrl,
  })

  // add new webLinkButton to the DOM
  const webLinksContainerHtml = webLinksContainer.innerHTML;

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
}

// TODO: create function
function changeBackGroundImage(){
// TODO:
};




// --------------------------------------------------------------
// OTHER CODE
// --------------------------------------------------------------



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