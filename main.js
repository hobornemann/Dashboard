// ============================================================
// CONTENTS 
// ============================================================
/* A. THIS FILE - 
    - Imports
    - Global Variables
    - EventListeners & related Functions 
   B. MODEL.JS
   C. FETCHDATA.JS
 */ 

// -------------------------------------------------------------
// IMPORTS
// -------------------------------------------------------------

import axios from 'axios'

import{
  getDefaultDashboardObject,
  getDashboardFromLocalStorage,
  getDashboardObject,
  setDashboardInLocalStorage
} from "./model.js"

import{
  fetchImage,
  getApiAccessKeys,
  updateDateAndTime,
  fetchWeatherData,
  getLocation,
  getFaviconUrl,
  getWebsiteMainUrl
} from "./fetchData.js"


// -------------------------------------------------------------
// GLOBAL VARIABLES & OBJECTS
// -------------------------------------------------------------

const defaultIconUrl = "/images/default-icon.png";



// -------------------------------------------------------------
// FEATURES/ELEMENTS 
// -------------------------------------------------------------

//TODO: delete or comment out localStorage = null when app has been developed
// TODO: update dashboard with current weather forecasts 
  // TODO: update favicon / FaviconUrl

 
// WINDOW - ON-LOAD  
window.addEventListener("DOMContentLoaded", async () => {
  localStorage.setItem("dashboard", null); //TODO: delete or comment out when app has been developed
  let dashboard =  await getDashboardObject();
  console.log("dashboard in window onload",dashboard)
  await fetchWeatherData()
  renderDynamicElementsOfIndexPage();
  renderIntialBackgroundImage();
  setInterval(renderDateAndTime(), 120000);  //TODO:  SKA ÄNDRAS TILL 30000 när appen är färdig
});



// WINDOW - RENDER DYNAMIC CONTENT
function renderDynamicElementsOfIndexPage(){
  renderDateAndTime(); 
  renderMainHeading();
  renderAllWebLinkCards();
  renderWeatherCards();
  renderNote();
};


  

// BACKGROUND IMAGE - CHANGE BACKGROUND IMAGE
const changeBackgroundImage_button = document.querySelector(".change-background-image-button");
changeBackgroundImage_button.addEventListener("click", async () => {
  const imageUrl = await fetchImage();  
  //console.log("imageUrl in eventlistener",imageUrl)
  document.body.style.backgroundImage = `url(${imageUrl})`;
}); 



// DATE & TIME - REDER DATE and TIME
function renderDateAndTime(){
  updateDateAndTime();  
  displayDateAndTime();
};


// DATE & TIME - DISPLAY DATE and TIME
function displayDateAndTime(){
  let dashboard = getDashboardFromLocalStorage();
  const dateElement = document.querySelector(".date");
  const timeElement = document.querySelector(".time");
  dateElement.textContent = dashboard.date;
  timeElement.textContent = dashboard.time;
};



// MAIN HEADING - RENDER
function renderMainHeading(){
  let dashboard = getDashboardFromLocalStorage();
  //console.log("dashboard in renderMainHeading: ", dashboard)
  const mainHeadingElement = document.querySelector(".main-heading");
  mainHeadingElement.textContent = dashboard.mainHeading;
  mainHeadingElement.addEventListener("input", () => {
    dashboard.mainHeading = mainHeadingElement.textContent;
    setDashboardInLocalStorage(dashboard);
  })
};




// WEBLINKS - RENDER ALL WEBLINK CARDS
function renderAllWebLinkCards(){
  let dashboard = getDashboardFromLocalStorage()
  console.log("dashboard in renderAllWebLinkCards:", dashboard)
  let webLinksContainerHtml = "";
  //console.log("dashboard in renderAllWebLinkCards", dashboard)
  //console.log("dashboard.webLinks in renderAllWebLinkCards",dashboard.webLinks)

   // Create dynamic HTML for all webLinks and display the HTML on the webpage 
  dashboard.webLinks.map(webLink => {
    webLinksContainerHtml = webLinksContainerHtml + 
    `<div class="webLink-card small-card" data-id="${webLink.id}">
      <a href="${webLink.webLinkUrl}" class="goto-webLink-url-button" target="_blank" rel="noreferrer noopener"> 
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
  //console.log(deleteWebLinkButtons)
  //console.log("dashboard", dashboard)
  
  deleteWebLinkButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const webLinkId = parseInt(e.currentTarget.parentNode.dataset.id);
      //console.log("webLinkId: ", webLinkId)
      //console.log("dashboard", dashboard)
      //console.log("typeof webLinkId: ", typeof webLinkId)

      // TODO: TODO:
      // Update the webLinks array of the dashboard object and the localStorage object 
      const myWebLinksArray = dashboard.webLinks.filter(webLink => webLink.id !== webLinkId);
      
      //console.log("myWebLinksArray", myWebLinksArray)
      //console.log("dashboard after filter-function ", dashboard)

      dashboard.webLinks = myWebLinksArray;
      setDashboardInLocalStorage(dashboard);

      // Delete the webLink-HTML from the webpage
      e.currentTarget.parentNode.parentNode.removeChild(e.currentTarget.parentNode);
    });
  });
};




// WEBLINKS - OPEN WEBLINK-DIALOG 
const openWebLinkDialog_button = document.querySelector(".open-webLink-dialog-button");
openWebLinkDialog_button.addEventListener("click", () =>{
  const webLinkDialog = document.querySelector(".webLink-dialog");
  webLinkDialog.show()
})



   //TODO: 
// WEBLINKS - ADD NEW WEBLINK 
const addNewWebLink_button = document.querySelector(".add-new-webLink-button");
addNewWebLink_button.addEventListener("click", () =>{
  
  let dashboard = getDashboardFromLocalStorage();
  let websiteUrl = document.querySelector(".webLink-url-input").value;
  console.log("websiteUrl in addNewWebLink-eventlistener: ", websiteUrl)
  let websiteMainUrl = getWebsiteMainUrl(websiteUrl);


  // Store new WebLink in the Dashboard Object 
  const newWebLinkId = Math.max(...dashboard.webLinks.map(webLink => webLink.id)) + 1;
  const newWebLinkUrl = document.querySelector(".webLink-url-input").value;
  const newWebLinkFaviconUrl = getFaviconUrl(websiteMainUrl);
  const newWebLinkHeading = document.querySelector(".webLink-heading-input").value;

  dashboard.webLinks.push({
    id: newWebLinkId, 
    webLinkFaviconUrl: newWebLinkFaviconUrl,
    webLinkHeading: newWebLinkHeading,
    webLinkUrl: newWebLinkUrl,
  })

  console.log("dashboard when addNewWebLink ready", dashboard)

  // Store new WebLink in localStorage  
  setDashboardInLocalStorage(dashboard);  


  renderAllWebLinkCards();

  /* // Render the new webLink 
  //TODO:  Append new webLink child to webLink container  (incl eventListener !!!)
  const webLinksContainer = document.querySelector(".webLinks-container");
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
  console.log("Slutet på addNewWebLink") */



  const webLinkDialog = document.querySelector(".webLink-dialog");
  webLinkDialog.close()
  document.querySelector(".webLink-url-input").value = "";
  document.querySelector(".webLink-heading-input").value = "";
});




  







// WEBLINKS - CANCEL NEW WEBLINK 
const cancelNewWebLink_button = document.querySelector(".cancel-new-webLink-button");
cancelNewWebLink_button.addEventListener("click", () =>{
  document.querySelector(".webLink-url-input").value = "";
  document.querySelector(".webLink-heading-input").value = "";
  const webLinkDialog = document.querySelector(".webLink-dialog");
  webLinkDialog.close()
})



// WEATHER CARDS - RENDER 
function renderWeatherCards(){
  let dashboard = getDashboardFromLocalStorage();
  let weatherContainerHtml = "";
  //console.log("dashboard i renderWeatherCards: ", dashboard)
  dashboard.weatherForecasts.map(weatherForecast => {
    let dateTime = new Date(weatherForecast.dateTime);
    let timeForForecast = dateTime.toLocaleTimeString('sv-SE').slice(0, -3);
    
    weatherContainerHtml = weatherContainerHtml + 
    `<div class="weather-card small-card">
      <img class="weather-icon" src="${weatherForecast.weatherIconUrl}">
      <div class="weather-day-temperature-comment">
        <div class="weather-day-heading">${weatherForecast.dayHeading} (kl. ${timeForForecast})</div>
        <div class="weather-temperature-comment">
          <div class="weather-temperature">&nbsp${Math.round(weatherForecast.temperature)}&deg&nbsp</div>
          <div class="weather-comment">&nbsp${weatherForecast.weatherDescription}&nbsp</div>
        </div>
      </div>
    </div>  
  `;
  });

  const weatherContainer = document.querySelector(".weather-container");
  weatherContainer.innerHTML = weatherContainerHtml;
  return dashboard;
};




// NOTE - RENDER 
async function renderNote(){
  let dashboard = getDashboardFromLocalStorage();
  const note = document.querySelector(".note");
  note.innerHTML = dashboard.note;
  note.addEventListener("input", () => {
    dashboard.note = note.innerHTML;
    setDashboardInLocalStorage(dashboard);
  })
};



// BACKGROUND IMAGE - RENDER INITIAL IMAGE
function renderIntialBackgroundImage(){
  const changeBackgroundImage_button = document.querySelector(".change-background-image-button");
  triggerAnEvent(changeBackgroundImage_button, 'click');  // triggerAnEvent(myElement, 'click', { category: 'football' });
};



// HELP FUNCTION - TRIGGER AN EVENT function
function triggerAnEvent (element, eventType, detail) {
  element.dispatchEvent(new CustomEvent(eventType, { detail }));
}



// --------------------------------------------------------------
// OTHER CODE
// --------------------------------------------------------------

