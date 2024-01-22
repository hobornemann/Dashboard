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
  extractMainDomainUrl,
  fetchNewsData,
  getDateAndTimeString
} from "./fetchData.js"



// -------------------------------------------------------------
// FEATURES/ELEMENTS 
// -------------------------------------------------------------

// WINDOW  
window.addEventListener("DOMContentLoaded", async () => { 
  try{
    //localStorage.setItem("dashboard", null); //TODO: comment out (or delete) when app has been fully developed
    let dashboard =  await getDashboardObject();
    await fetchWeatherData("","")
    await fetchNewsData();
    renderDynamicElementsOfIndexPage();
    renderIntialBackgroundImage();
    setInterval(renderDateAndTime, 10000);  
  }
  catch(error){
    console.log("Error in window.addEventListener function. ", error.message)
  }
});


// WINDOW 
function renderDynamicElementsOfIndexPage(){
  try{
    renderDateAndTime(); 
    renderMainHeading();
    renderAllWebLinkCards();
    renderWeatherCards();
    renderNewsCards()
    renderNote();
  }
  catch(error){
    console.log("Error in the renderDynamicElementsOfIndexPage() function. ", error.message)
  }
};


// DATE & TIME 
function renderDateAndTime(){
  try{
    updateDateAndTime();  
    let dashboard = getDashboardFromLocalStorage();
    const dateElement = document.querySelector(".date");
    const timeElement = document.querySelector(".time");
    if (dashboard && dashboard.date && dashboard.time) {
      dateElement.textContent = dashboard.date;
      timeElement.textContent = dashboard.time;
    } else {
      console.error("Dashboard data is incomplete or missing.");
    }
  } 
  catch(error){
    console.log("Error in the renderDateAndTime() function. ", error.message)
  }
};


// MAIN HEADING 
function renderMainHeading(){
  try{
    let dashboard = getDashboardFromLocalStorage();
    const mainHeadingElement = document.querySelector(".main-heading");
    mainHeadingElement.textContent = dashboard.mainHeading;
  
    mainHeadingElement.addEventListener("input", () => {
      dashboard.mainHeading = mainHeadingElement.innerHTML;
      setDashboardInLocalStorage(dashboard);
    })
  }
  catch(error){
    console.log("Error in renderMainHeading() function.", error.message)
  }
};




// WEBLINKS 
function renderAllWebLinkCards(){
  // Get the data
  let dashboard = getDashboardFromLocalStorage()
  let webLinksContainerHtml = "";
  
  try{
    // Create the dynamic HTML for all webLinks and display the HTML on the webpage 
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
  }
  catch(error){
    console.log("Error in creating dynamic HTML for all weblinks in renderAllWebLinkCards() function.", error.message)
  }

  try{
    // Add a deleteWebLinkButton-EventListener to each webLink 
    const deleteWebLinkButtons = document.querySelectorAll(".delete-webLink-button");  
    deleteWebLinkButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const webLinkId = parseInt(e.currentTarget.parentNode.dataset.id);
        // Update the webLinks array of the dashboard object and the localStorage object 
        const myWebLinksArray = dashboard.webLinks.filter(webLink => webLink.id !== webLinkId);
        dashboard.webLinks = myWebLinksArray;
        setDashboardInLocalStorage(dashboard);
        // Delete the webLink-HTML from the webpage
        e.currentTarget.parentNode.parentNode.removeChild(e.currentTarget.parentNode);
      });
    });
  }
  catch(error) {
    console.log("Error in adding event listeners to deleteWebLinkButtons in getDashboardFromLocalStorage() function.", error.message)
}
};


// WEBLINKS 
const openWebLinkDialog_button = document.querySelector(".open-webLink-dialog-button");
openWebLinkDialog_button.addEventListener("click", () =>{
  try{
    const webLinkDialog = document.querySelector(".webLink-dialog-outer");
    const numberOfWebLinks = document.querySelectorAll(".webLink-card").length;
    if(numberOfWebLinks < 7){
      webLinkDialog.show()
    } else {
      alert("Maximalt antal webblänkar är 7. Radera en webblänk för att kunna lägga till en ny.")
    }
  }
  catch(error){
    console.log("Error when adding event listeners to openWebLinkDialog_button.", error.messag)
  }
});


// WEBLINKS 
const addNewWebLink_button = document.querySelector(".add-new-webLink-button");
addNewWebLink_button.addEventListener("click", () =>{
  try{
    let websiteUrl = document.querySelector(".webLink-url-input").value;
    let websiteMainDomainUrl = extractMainDomainUrl(websiteUrl);
    
    if(websiteMainDomainUrl){
      let dashboard = getDashboardFromLocalStorage();
      websiteUrl = document.querySelector(".webLink-url-input").value;
      websiteMainDomainUrl = extractMainDomainUrl(websiteUrl);
  
      // Store new WebLink Item in the Dashboard Object 
      const newWebLinkId = Math.max(...dashboard.webLinks.map(webLink => webLink.id)) + 1;
      const newWebLinkUrl = document.querySelector(".webLink-url-input").value;
      const newWebLinkFaviconUrl = getFaviconUrl(websiteMainDomainUrl);
      const newWebLinkHeading = document.querySelector(".webLink-heading-input").value;
  
      dashboard.webLinks.push({
        id: newWebLinkId, 
        webLinkFaviconUrl: newWebLinkFaviconUrl,
        webLinkHeading: newWebLinkHeading,
        webLinkUrl: newWebLinkUrl
      })
  
      // Store new WebLink Item in localStorage  
      setDashboardInLocalStorage(dashboard);  
      document.querySelector(".webLink-url-input").value = "";
      document.querySelector(".webLink-heading-input").value = "";
  
      const webLinkDialog = document.querySelector(".webLink-dialog-outer");
      webLinkDialog.close()
      renderAllWebLinkCards();
    } 
    else {
      if(!websiteMainDomainUrl){
        alert("Webbadressen du angav är inte helt korrekt. Glöm inte att skriva 'http://' eller 'https://' i början av webbadressen.")
      } else if (numberOfWebLinks > 7){
        alert("Maximalt antal webadresser är 7.")
      }
    }  
  }
  catch(error){
    console.log("Error in adding event listeners to the addNewWebLink_button in.", error.message)
  }
});


// WEBLINKS 
const cancelNewWebLink_button = document.querySelector(".cancel-new-webLink-button");
cancelNewWebLink_button.addEventListener("click", () =>{
  try{
    document.querySelector(".webLink-url-input").value = "";
    document.querySelector(".webLink-heading-input").value = "";
    const webLinkDialog = document.querySelector(".webLink-dialog-outer");
    webLinkDialog.close()
  }
  catch(error){
    console.log("Error when adding event listeners to cancelNewWebLink_button. ", error.message)
  }
})


// WEATHER 
function renderWeatherCards(){
  let dashboard = getDashboardFromLocalStorage();
  let weatherContainerHtml = "";
  try{
    weatherContainerHtml = `<div class="weather-location-heading">${dashboard.weather.cityName} (${dashboard.weather.countryCode})</div>`;
    // Create dynamic HTML for all weather forecasts and display on the webpage   
    dashboard.weather.forecasts.map(forecast => {
      let dateTime = new Date(forecast.dateTime);
      let timeForForecast = dateTime.toLocaleTimeString('sv-SE').slice(0, -3);
      weatherContainerHtml = weatherContainerHtml + 
      `<div class="weather-card small-card">
        <img class="weather-icon" src="${forecast.weatherIconUrl}">
        <div class="weather-day-temperature-comment">
          <div class="weather-day-heading">${forecast.dayHeading} (${timeForForecast})</div>
          <div class="weather-temperature-comment">
            <div class="weather-temperature">&nbsp${Math.round(forecast.temperature)}&deg&nbsp</div>
            <div class="weather-comment">&nbsp${forecast.weatherDescription}&nbsp</div>
          </div>
        </div>
      </div>  
    `;
    });
  
    const weatherContainer = document.querySelector(".weather-container");
    weatherContainer.innerHTML = weatherContainerHtml;
    return dashboard;
  }
  catch(error){
    console.log("Error in renderWeatherCards() function. ", error.message)
  }
};


// WEATHER 
const openWeatherDialog_button = document.querySelector(".open-weather-dialog-button");
openWeatherDialog_button.addEventListener("click", () =>{
  try{
    const weatherDialog = document.querySelector(".weather-dialog-outer");
      weatherDialog.show()
  }
  catch(error){
    console.log("Error when adding event listener to openWeatherDialog_button.", error.message)
  }
});

// WEATHER 
const changeWeatherLocation_button = document.querySelector(".change-weather-location-button");
changeWeatherLocation_button.addEventListener("click", async () =>{
  try{
    let cityName = document.querySelector(".weather-cityName-input").value;
    let countryCode = document.querySelector(".weather-countryCode-input").value;
    let dashboard = getDashboardFromLocalStorage();
    dashboard.weather.cityName = cityName;
    dashboard.weather.countryCode = countryCode;
    // Store new Weather Item in localStorage  
    setDashboardInLocalStorage(dashboard); 
    document.querySelector(".weather-cityName-input").value = "";
    document.querySelector(".weather-countryCode-input").value = "";
    const weatherDialog = document.querySelector(".weather-dialog-outer");
    weatherDialog.close()
    await fetchWeatherData(cityName,countryCode);
    renderWeatherCards(); 
  }
  catch(error){
    console.log("Error: ", error.message);
  } 
});

// WEATHER 
const cancelChangeWeatherLocation_button = document.querySelector(".cancel-change-weather-location-button");
cancelChangeWeatherLocation_button.addEventListener("click", () =>{
  try{
    document.querySelector(".weather-cityName-input").value = "";
    document.querySelector(".weather-countryCode-input").value = "";
    const weatherDialog = document.querySelector(".weather-dialog-outer");
    weatherDialog.close()
  }
  catch(error){
    console.log("Error when adding event listeners to cancelChangeWeatherLocation_button. ", error.message)
  }
});



// NEWS 
function renderNewsCards(){
  try{
    let dashboard = getDashboardFromLocalStorage();
    let newsContainerHtml = "";
    // let imageUrl = "https://ichef.bbci.co.uk/news/1024/branded_news/C23F/production/_132372794_p0h60l8w.jpg";
    // let articleUrl = "https://www.bbc.co.uk/news/uk-england-leicestershire-68023459";
  
    dashboard.newsArticles.map(newsArticle => {
      let dateAndTimeString = getDateAndTimeString(newsArticle.publicationDate);
      // Create dynamic HTML for all weather forecasts and display on the webpage 
      newsContainerHtml = newsContainerHtml + 
      `<a class="news-card small-card" href="${newsArticle.url}" target="_blank">
        <div class="news-image-author-and-publication-date">
          <img class="news-image" src="${newsArticle.imageUrl}">
          <div class="news-author-and-publication-date">
            <div class="news-author">${newsArticle.author}</div>
            <div class="news-publication-date">${dateAndTimeString}</div>
          </div>  
        </div>
        <div class="news-title-and-description">
          <div class="news-title">${newsArticle.title}</div>
          <div class="news-description">${newsArticle.description}</div>
        </div>
      </a> 
      `;
    });
  
    const newsContainer = document.querySelector(".news-container");
    newsContainer.innerHTML = newsContainerHtml;
    return dashboard;
  }
  catch(error){
    console.log("Error when rendering news cards in renderNewsCards() function. ", error.message)
  }
}


// NOTE 
function renderNote(){
  try{
    let dashboard = getDashboardFromLocalStorage();
    const note = document.querySelector(".note");
    note.innerHTML = dashboard.note;
    
    note.addEventListener("input", () => {
      dashboard.note = note.innerHTML;
      setDashboardInLocalStorage(dashboard);
    })
  }
  catch(error){
    console.log("Error when rendering note in renderNote() function.", error.message)
  }
};


// BACKGROUND IMAGE
function renderIntialBackgroundImage(){
  try{
    const changeBackgroundImage_button = document.querySelector(".change-background-image-button");
    triggerAnEvent(changeBackgroundImage_button, 'click');  
  }
  catch(error){
    console.log("Error in redering initial background image in renderIntialBackgroundImage() function. ", error.message) 
  }
};


// BACKGROUND IMAGE 
const changeBackgroundImage_button = document.querySelector(".change-background-image-button");
changeBackgroundImage_button.addEventListener("click", async () => {
  try{  
    const imageUrl = await fetchImage();  
    document.body.style.backgroundImage = `url(${imageUrl})`;
  }
  catch(error){
    console.log("Error in adding event listener to changeBackgroundImage_button.", error.message)
  }
}); 


// HELP FUNCTION 
function triggerAnEvent(element, eventType, detail) {
  try{
    element.dispatchEvent(new CustomEvent(eventType, { detail }));
  }
  catch(error){
    console.log("Error in triggering an event in the triggerAnEvent(element, eventType, detail) function.", error.message)
  }
}

