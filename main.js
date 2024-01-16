// ------------------------------------------------------------
// CONTENTS
// ------------------------------------------------------------
/*  - Imports
    - Global Variables
    - Functions per Feature/Element
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


// ----------------------------------------------
// UNCOMMENT WHEN READY TO USE - WEATHER
// ----------------------------------------------

/* getLocation();

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
} */

/* fetchData()   // läggs in window. ...contentload... */

// ----------------------------------------------------
// UNCOMMENT THE ABOVE 
// ----------------------------------------------------








// ----------------------------------------------
// UNCOMMENT WHEN READY TO USE - IMAGES
// ----------------------------------------------

/* fetchImages();

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
} */

// ----------------------------------------------------
// UNCOMMENT THE ABOVE 
// ----------------------------------------------------



// -------------------------------------------------------------
// GLOBAL VARIABLES & OBJECTS
// -------------------------------------------------------------

let dashboard;
const defaultIconUrl = "/images/default-icon.png";


function loadDashboardObject(){
  let dashboardInLocalStorage = getDashboardFromLocalStorage();
  if(dashboardInLocalStorage == null) {
    console.log("dashboardInLocalStorage == null");
    getDefaultDashboardAndStoreInLocalStorage();
  } else{
    dashboard = dashboardInLocalStorage;
  }
  // TODO: update dashboard with current weather forecasts 
  // TODO: update favicon / FaviconUrl
};


function setDashboardInLocalStorage(dashboard){
  localStorage.setItem("dashboard", JSON.stringify(dashboard));
}

function getDashboardFromLocalStorage(){
  dashboard = getDashboardFromLocalStorage();
}


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
    note: "Här kan du skriva dina anteckningar. Anteckningarna sparas automatiskt.",
  }; 

  
  setDashboardInLocalStorage(dashboard);

};





// -------------------------------------------------------------
// FEATURES/ELEMENTS 
// -------------------------------------------------------------

// 



//TODO: delete or comment out localStorage = null when app has been developed
// TODO: update dashboard with current weather forecasts 
  // TODO: update favicon / FaviconUrl


// WINDOW - ON-LOAD  
window.addEventListener("DOMContentLoaded", () => {
  //localStorage.setItem("dashboard", null); //TODO: delete or comment out when app has been developed
  loadDashboardObject();  
  renderDynamicElementsOfIndexPage();
  setInterval(renderDateAndTime, 120000);  //TODO:  SKA ÄNDRAS TILL 30000 när appen är färdig
});


// WINDOW - RENDER DYNAMIC CONTENT
function renderDynamicElementsOfIndexPage(){
  renderDateAndTime(); 
  renderMainHeading();
  renderAllWebLinkCards();
  renderWeatherCards();
  renderNote();
};


// DATE & TIME - REDER DATE and TIME
function renderDateAndTime(){
  getDateAndTime();
  displayDateAndTime();
};

// DATE & TIME - GET DATE and TIME
function getDateAndTime(){
  const currentDateTime = new Date(); 
  const time =    ((currentDateTime.getHours() < 10)?"0":"")
                  + currentDateTime.getHours() + ":" 
                  + ((currentDateTime.getMinutes() < 10)?"0":"")  
                  + currentDateTime.getMinutes(); 
                  
  const date =    currentDateTime.getFullYear() + "-"
                  + ((currentDateTime.getMonth() + 1 < 10)?"0":"") 
                  + (currentDateTime.getMonth() + 1 )  + "-" 
                  + ((currentDateTime.getDate() < 10)?"0":"") 
                  + currentDateTime.getDate(); 
  dashboard.time = time;
  dashboard.date = date;
  setDashboardInLocalStorage(dashboard);
};

// DATE & TIME - DISPLAY DATE and TIME
function displayDateAndTime(){
  dashboard = getDashboardFromLocalStorage();
  const timeElement = document.querySelector(".time");
  const dateElement = document.querySelector(".date");
  timeElement.textContent = dashboard.time;
  dateElement.textContent = dashboard.date;
};



// MAIN HEADING - RENDER
function renderMainHeading(){
  const mainHeadingElement = document.querySelector(".main-heading");
  mainHeadingElement.textContent = dashboard.mainHeading;
  mainHeadingElement.addEventListener("input", () => {
    dashboard.mainHeading = mainHeadingElement.textContent;
    setDashboardInLocalStorage(dashboard);
    console.log(getDashboardFromLocalStorage());
  })
};



// WEBLINKS - OPEN ADD-WEBLINK-FORM 
const openAddWebLinkForm_button = document.querySelector(".open-add-webLink-form-button");
openAddWebLinkForm_button.addEventListener("click", () =>{
  const addWebLink_form = document.querySelector(".add-webLink-form");
  addWebLink_form.classList.remove("hidden");
})

// WEBLINKS - RENDER ALL WEBLINK CARDS
function renderAllWebLinkCards(){
  let webLinksContainerHtml = "";

   // Create dynamic HTML for all webLinks and display the HTML on the webpage 
  dashboard.webLinks.map(webLink => {
    webLinksContainerHtml = webLinksContainerHtml + 
    `<div class="webLink-card small-card" data-id="${webLink.id}">
      <a href="${webLink.webLinkUrl}" class="button-goto-webLink-url" target="_blank" rel="noreferrer noopener"> 
        <img class="webLink-favicon" src="${webLink.webLinkFaviconUrl}">
        <div class="webLink-heading">${webLink.webLinkHeading}</div>
      </a>  
      <button class="delete-webLink-button">&nbsp;x&nbsp;</button>
    </div>
    `;
    const webLinksContainer = document.querySelector(".webLinks-container");
    webLinksContainer.innerHTML = webLinksContainerHtml;
  });

  // Add a deleteWebLinkButton-EventListener to each webLink 
  const deleteWebLinkButtons = document.querySelectorAll(".delete-webLink-button");
  deleteWebLinkButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const webLinkId = e.currentTarget.parentNode.dataset.id;
      console.log("webLinkId: ", webLinkId)

      // Delete the webLink object from the dashboard and localStorage 
      dashboard = dashboard.webLinks.filter(webLink => webLink.id !== webLinkId);
      setDashboardInLocalStorage(dashboard);

      // Delete the webLink-HTML from the webpage
      e.currentTarget.parentNode.parentNode.removeChild(e.currentTarget.parentNode);
    });
  });
};


// WEBLINKS - ADD NEW WEBLINK (and RENDER)
const addNewWebLink_button = document.querySelector(".add-new-webLink-button");
addNewWebLink_button.addEventListener("click", () => {
  
  // Store new WebLink in the Dashboard Object 
  const newWebLinkId = Math.max(...dashboard.webLinks.map(webLink => webLink.id)) + 1;
  const newWebLinkFaviconUrl = defaultIconUrl;  // TODO:  get favicon and store url in the dashboard object
  const newWebLinkUrl = document.querySelector("#webLink-url-input").value;
  const newWebLinkHeading = document.querySelector("#webLink-heading-input").value;

  dashboard.webLinks.push({
    id: newWebLinkId, 
    webLinkFaviconUrl: newWebLinkFaviconUrl,
    webLinkHeading: newWebLinkHeading,
    webLinkUrl: newWebLinkUrl,
  })

  // Store new WebLink in localStorage   T
  updateLocalStorage(dashboard);  

  // Render the new webLink 
//TODO:  Append new webLink child to webLink container  (incl eventListener !!!)
  const webLinksContainer =document.querySelector(".webLinks-container");
  let webLinksContainerHtml = webLinksContainer.innerHTML;
  const newWebLinkHtml =  
  `<div class="webLink-card small-card" data-id=${newWebLinkId}>
    <a href="${newWebLinkUrl}" class="goto-webLink-url-button" target="_blank" rel="noreferrer noopener">
      <img class="webLink-favicon" src="${newWebLinkFaviconUrl}">
      <div class="webLink-heading">${newWebLinkHeading}</div>
    </a> 
    <button class="delete-webLink-button">&nbsp;x&nbsp;</button>
  </div>`;
  webLinksContainerHtml = webLinksContainerHtml + newWebLinkHtml;
  webLinksContainer.innerHTML = webLinksContainerHtml;

  // TODO:  Do I need to call a display function to show the added webLinkButton or will that happen automatically?
  

  // Hide the Add WebLink Form again
  addWebLink_form.classList.add("hidden");

});




// WEATHER CARDS - RENDER 
function renderWeatherCards(){

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

  const weatherContainer = document.querySelector(".weather-container");
  weatherContainer.innerHTML = weatherContainerHtml;
};




// NOTE - RENDER 
function renderNote(){

  note.innerHTML = dashboard.note;

  const note_p = document.querySelector(".note");
  note_p.addEventListener("input", () => {
    dashboard.note = note.textContent;
    setDashboardInLocalStorage(dashboard);
  })
};



// CHANGE BACKGROUND IMAGE
const changeBackgroundImage_button = document.querySelector(".change-background-image-button");
changeBackgroundImage_button.addEventListener("click", changeBackGroundImage())

function changeBackGroundImage(){
  // TODO:
  };




// -------------------------------------------------------------
// FUNCTIONS
// -------------------------------------------------------------






// --------------------------------------------------------------
// OTHER CODE
// --------------------------------------------------------------




/* 
// TODO: get favicon and store url in the dashboard object
// TODO: Do I need to call a display function to show the added webLinkButton or will that happen automatically?
function renderNewWebLink(){
  // TODO: QUESTION: Why is dashboard not accessible from this function????  
  dashboard = getDashboardFromLocalStorage();
  console.log("dashboard in addNewWebLink");
  console.log(dashboard);
  // add new webLink object to the dashboard object
  const newWebLinkId = Math.max(...dashboard.webLinks.map(webLink => webLink.id)) + 1;
  console.log ("newWebLinkId")
  console.log (newWebLinkId)
  
  const newWebLinkFaviconUrl = defaultIconUrl;  // TODO:  // TODO: get favicon and store url in the dashboard object
  console.log("newWebLinkFaviconUrl")
  console.log(newWebLinkFaviconUrl)

  const newWebLinkUrl = document.querySelector("#webLink-url-input").value;
  console.log("newWebLinkUrl")
  console.log(newWebLinkUrl)

  const newWebLinkHeading = document.querySelector("#webLink-heading-input").value;
  console.log("newWebLinkHeading")  
  console.log(newWebLinkHeading)  

  dashboard.webLinks.push({
    id: newWebLinkId, 
    webLinkFaviconUrl: newWebLinkFaviconUrl,
    webLinkHeading: newWebLinkHeading,
    webLinkUrl: newWebLinkUrl,
  })

  console.log("dashboard")
  console.log(dashboard)

  setDashboardInLocalStorage(dashboard);

  console.log("CHECK localstorage for new weblink")


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
 */
// TODO: create function





// TODO: addNewWebLink_button.addEventListener("click", addNewWebLink())  QUESTION: varför funkar inte detta?


/* mainHeadingElement.addEventListener("input", () => {
  dashboard.mainHeading = mainHeadingElement.textContent;
  localStorage.setItem("dashboard", JSON.stringify(dashboard));
  console.log(JSON.parse(localStorage.getItem("dashboard")));
}) */

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


<div class="webLink-card small-card" data-id="1">
                <a href="www.Google.com" class="button-goto-webLink-url" target="_blank" rel="noreferrer noopener">  <!-- SECURITY-addition: rel="noreferrer noopener" -->
                  <img class="webLink-favicon" src="">
                  <div class="webLink-heading">Google</div>
                </a>  
                <button class="delete-webLink-button">&nbsp;x&nbsp;</button>
              </div>

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