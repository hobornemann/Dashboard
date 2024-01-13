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
const buttonAddWebLinks = document.querySelector(".button-add-webLink");
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
  //loadPage(dashboard)
});



buttonChangeBackground.addEventListener("click", changeBackGroundImage())


// -------------------------------------------------------------
// FUNCTIONS
// -------------------------------------------------------------

async function loadPage(dashboard){
let bodyContainerHtml = `
<header class="header-container">
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
  `<button class="webLink-card small-card">
    <img class="webLink-favicon" src="${webLink.webLinkUrl}"></img>
    <div class="webLink-heading">${webLink.webLinkHeading}</div>
  </button>`;
});

bodyContainerHtml = bodyContainerHtml + 
  `</div>
  <button class="button-add-webLink button">Ny webblänk</button>
</article>
<article class="card">
<h3 class="card-heading">Väder</h3>
<div class="weather-container">`;

dashboard.weatherForecasts.map(weatherForecast => {
  bodyContainerHtml = bodyContainerHtml + 
  `<div class="weather-card small-card">
  <img class="weather-icon" src="${dashboard.weatherForecast.weatherIcon}"/>
  <div class="weather-day-temperature-details">
    <div class="weather-day-heading">${dashboard.weatherForecast.dayHeading}</div>
    <div class="weather-temperature-details">
      <div class="weather-temperature">&nbsp;${dashboard.weatherForecast.temperature}&deg;C&nbsp;</div>
      <div class="weather-details">&nbsp;${dashboard.weatherForecast.weatherDetails}&nbsp;</div>
    </div>
  </div>
</div>  
`;
});

bodyContainerHtml = bodyContainerHtml + 
`<button class="button-weather-location button">Ange ort</button>
</article>
<article class="card">
  <h3 class="card-heading">Nyheter</h3>
  <div class="news-container">
    <!-- here the news items are inserted -->
  </div>  
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
/*           
          <!-- here the weather items are inserted -->
        </div>
        <button class="button-weather-location button">Ange ort</button>
      </article>
      <article class="card">
        <h3 class="card-heading">Nyheter</h3>
        <div class="news-container">
          <!-- here the news items are inserted -->
        </div>  
      </article>
      <article class="card">
        <h3 class="card-heading">Anteckningar</h3>
        <div class="notes-card small-card">
          <p class="notes" contenteditable="true">my notes kommer här </p>  
        </div>
      </article>
    </section> 
</main>
<div class="empty-container2"></div>
<footer class="footer-container">
  <button class="button-change-background button">Byt bakgrundsbild</button>
</footer> 
  `;*/

  bodyContainer.innerHTML = bodyContainerHtml;
};

function getDefaultDashboardAndStoreInLocalStorage(){
  let dashboard = {
    dateTime: "14:55  2023-12-13",
    mainHeading: "My Dashboard",
    webLinks: [
      { 
        webLinkHeading: "Google",
        webLinkUrl: "www.google.se",
      },
    ],
    weatherForecasts: [
      {
        weatherIcon: "",
        dayHeading: "Idag",
        temperature: "-4&degr;C",
        weatherDetails: "Sol och moln"        
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
    notes: "här kan du skriva anteckningar",
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


function changeBackGroundImage(){

};

function displayWebLinks(dashboard) {
 
 
  /* console.log("displayProducts - products: ", products);
  productsContainer.innerHTML = "";
  products.map((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("card");
    const prodText = product.description.slice(0, 70);
    const titleText = product.title.slice(0, 70);
    productElement.innerHTML = `
        <img src="${product.image}">
        <h2>${titleText}...</h2>
        <p>${prodText}...</p>
        <div id="price-quantity">
            <h3>$ ${product.price}</h3>
            <button class="minus-btn" data-id="${product.id}">-</button>
            <p class="quantity" data-id="${product.id}">${product.quantity}</p>
            <button class="plus-btn" data-id="${product.id}">+</button>
        </div>`;
    productsContainer.appendChild(productElement); */
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