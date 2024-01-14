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

const mainHeadingElement = document.querySelector(".main-heading");
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
  
  // Reset dashboard in localStorage
  localStorage.setItem("dashboard", null);
  
  let dashboardInLocalStorage = JSON.parse(localStorage.getItem("dashboard"));
  
  console.log("dashboardInLocalStorage: ")
  console.log(dashboardInLocalStorage)
  
  

  if(dashboardInLocalStorage == null) {
    console.log("dashboardInLocalStorage == null");

    getDefaultDashboardAndStoreInLocalStorage();
  } else{

    dashboard = dashboardInLocalStorage;
  }
  
  // TODO: update dashboard with current weather forecasts 
  // TODO: update favicon / FaviconUrl
  console.log(dashboard);

  updateBodyContainerStepByStep();
  //displayBodyContainer(dashboard) // TODO:  throws error
  //displayCurrentTime();  TODO: activate clock by uncommenting this line
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

buttonChangeBackground.addEventListener("click", changeBackGroundImage())


// -------------------------------------------------------------
// FUNCTIONS
// -------------------------------------------------------------

function updateBodyContainerStepByStep(){

  displayDateTime(); 
  displayMainHeading();
  displayWebLinkCards();
  displayWeatherCards();
  displayNotes();
}






function displayDateTime(){
  const dateTimeElement = document.querySelector(".dateTime");
  dateTimeElement.textContent = dashboard.dateTime;
};

function displayMainHeading(){
  mainHeadingElement.textContent = dashboard.mainHeading;
}

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



// TODO: expand the dashboard object with news-data
function getDefaultDashboardAndStoreInLocalStorage(){
  
  dashboard = {
    dateTime: "14:55  2023-12-13",
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

  dashboard.dateTime = getDateTime();
  localStorage.setItem("dashboard", JSON.stringify(dashboard));
 
}

function getDateTime(){
  const currentDateTime = new Date(); 
  const dateTime =  + ((currentDateTime.getHours() < 10)?"0":"") 
                  + currentDateTime.getHours() + ":" 
                  + ((currentDateTime.getMinutes() < 10)?"0":"")  
                  + currentDateTime.getMinutes() + "  " 
                  + currentDateTime.getFullYear() + "-"
                  + ((currentDateTime.getMonth() + 1 < 10)?"0":"") 
                  + (currentDateTime.getMonth()+1)  + "-" 
                  + ((currentDateTime.getDate() < 10)?"0":"") 
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