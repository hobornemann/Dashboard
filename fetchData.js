import axios from 'axios'

import{
  getDefaultDashboardObject,
  getDashboardFromLocalStorage,
  getDashboardObject,
  setDashboardInLocalStorage
} from "./model.js"

export{
  fetchImage,
  getApiAccessKeys,
  updateDateAndTime,
  fetchWeatherData,
  getLocation,
  extractMainDomainUrl,
  getFaviconUrl
}



// TODO: get Favicons via google's url
// WEBLINKS - GET FAVICON-URLs
/* async function fetchFaviconUrl(websiteMainUrl){
  let faviconUrl ="/images/default-icon.png";
   const response = await getApiAccessKeys();
  let ACCESS_KEY = response.data.unsplash;
  const url = `google.com/s2/favicons?domain_url=${websiteMainUrl}&sz=256`;
    try{
      const response = await axios.get(url)  
      console.log("response", response)  
      if(response){
        faviconUrl = response
        console.log("faviconUrl: ", faviconUrl)
      }
    }
    catch(error){
      console.log("Error: ", error.message)
    }
    return faviconUrl;
  } */
  

//TODO:  
/* 
  function getFaviconUrl(websiteMainUrl) {
    
    console.log("websiteMainUrl in getFaviconUrl",websiteMainUrl)
    // Construct the URL for the Google favicon service
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${websiteMainUrl}&sz=256`;
    console.log("faviconUrl in getFaviconUrl: ",faviconUrl)
// &sz=256
    return faviconUrl;
} */

function getFaviconUrl(websiteMainDomainUrl) {
  try{
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${websiteMainDomainUrl}&sz=256`;
    return faviconUrl;
  }
  catch(error){
    alert("Unable to get the faviconUrl.", error.message)
    const faviconUrl = "/images/default-icon.png";
    return faviconUrl;
  }
}



//TODO: TODO: TODO:
function extractMainDomainUrl(websiteUrl){
  try{
    const urlObject = new URL(websiteUrl);
    const mainDomainUrl = urlObject.hostname;
    return mainDomainUrl;
  } 
  catch(error){
    alert("Unable to extract main domain url. Please check the spelling of the website-url.", error.message)
  }
}
  



  /* console.log("websitUrl in getWebsiteMainUrl",websiteUrl)
  if(validateWebsiteUrl(websiteUrl)){
    let websiteMainUrl = "";
      
      if(websiteUrl.substring(0,7) == "http://"){
        websiteMainUrl = websiteUrl.slice(7)
      } else if (websiteUrl.substring(0,8) == "https://"){
        websiteMainUrl = websiteUrl.slice(8)
      } 

      websiteMainUrl = websiteMainUrl.substring(0, websiteMainUrl.indexOf('/')-1);
      console.log("websiteMainUrl: ", websiteMainUrl)
      
      if(websiteMainUrl){
        return websiteMainUrl;
      } else {
        error => {
          reject(error); 
          console.log("Error occurred in the getWebsiteMainUrl function.", error.message)
        }
      };  
    }; 
} */



  function validateWebsiteUrl(websiteUrl) {
    var urlPattern = /^(https?:\/\/)?([a-z\d.-]+)\.([a-z]{2,})(\/[^\s]*)?$/i;
    return urlPattern.test(websiteUrl);
  }


//TODO: UNCOMMENT THE LINES BELOW WHEN PROJECT IS FINISHED
// BACKGROUND IMAGE - GET IMAGE-URL 
async function fetchImage(){
    let imageUrl ="/images/default-image.jpg";
    /* const response = await getApiAccessKeys();
    let ACCESS_KEY = response.data.unsplash;
    const url = `https://api.unsplash.com/photos/random?client_id=${ACCESS_KEY}`;
      try{
        const response = await axios.get(url)    
        if(response){
          imageUrl = response.data.urls.regular; 
        }
      }
      catch(error){
        console.log("Error: ", error.message)
      }
      ACCESS_KEY=""; */
      return imageUrl;
} 


  
  // ACCESS KEYS
  async function getApiAccessKeys(){
  
    try{
      const response = await axios.get('./apiAccessKeys.json')
      const apiAccessKeys = response;
      return apiAccessKeys;
    }
    catch(error){
      console.error("Error: ", error.message)
    }
  }
  
  
  
  // DATE & TIME - GET DATE and TIME
  function updateDateAndTime(){
    try{
      let dashboard = getDashboardFromLocalStorage();
      const currentDateTime = new Date(); 
      const date =    currentDateTime.getFullYear() + "-"
                      + ((currentDateTime.getMonth() + 1 < 10)?"0":"") 
                      + (currentDateTime.getMonth() + 1 )  + "-" 
                      + ((currentDateTime.getDate() < 10)?"0":"") 
                      + currentDateTime.getDate(); 
      const time =    ((currentDateTime.getHours() < 10)?"0":"")
                      + currentDateTime.getHours() + ":" 
                      + ((currentDateTime.getMinutes() < 10)?"0":"")  
                      + currentDateTime.getMinutes();                         
      dashboard.date = date;
      dashboard.time = time;
      setDashboardInLocalStorage(dashboard);
    } 
    catch(error){
      console.log("Kunde inte uppdatera datum och tid", error.message)
    }      
}

  

  
// WEATHER - FETCH WEATHER DATA
async function fetchWeatherData (){
  try{
  const coords = await getLocation();
  // console.log("coords", coords)
  const apiKeysResponse = await getApiAccessKeys();
  let APIkey = apiKeysResponse.data.openWeatherMap;
  //const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=SE`
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${APIkey}&units=metric&lang=sv`
  APIkey = "";
  //console.log("url weather: ", url)
  
    const weatherResponse = await axios.get(url)
    //console.log("weatherResponse: ", weatherResponse)
    const weatherData = weatherResponse.data;
    //console.log("weatherData", weatherData);

    saveWeatherDataToDashboardAndLocalStorage(weatherData); 
  }
  catch(error){
    console.log("Error:", error.message)
  }
} 

function saveWeatherDataToDashboardAndLocalStorage(weatherData){
  
  // Get array-index of today, tomorrow and tomorrow-next (at 12.00 hours, or now if now is after 12.00 hours)
  //console.log("weatherData in saveWeathDataToDashboardAndLocalStorage",weatherData) 

  const dateTimeStringNow = weatherData.list[0].dt_txt;
  //console.log("weatherData.list[0].dt_txt",weatherData.list[0].dt_txt) 
  const dateTime = new Date(dateTimeStringNow);
  //console.log("dateTime in saveWeatherData...",dateTime)
  const hoursNow = dateTime.getHours();

  //console.log("hoursNow",hoursNow)
  

  let indexOfTodayInOpenWeatherMap = null;
  let indexOfTomorrowInOpenWeatherMap = null;
  let indexOfTomorrowNextInOpenWeatherMap = null;

  if (hoursNow < 12){
    indexOfTodayInOpenWeatherMap = (12-hoursNow)/3;
    indexOfTomorrowInOpenWeatherMap = indexOfTodayInOpenWeatherMap + (24/3);
    indexOfTomorrowNextInOpenWeatherMap = indexOfTomorrowInOpenWeatherMap + (24/3);
  } else {
    indexOfTodayInOpenWeatherMap = 0;
    indexOfTomorrowInOpenWeatherMap = indexOfTodayInOpenWeatherMap + (24-hoursNow)/3 + (12/3);
    indexOfTomorrowNextInOpenWeatherMap = indexOfTomorrowInOpenWeatherMap + (24/3);
  }

  const indicesInOpenWeatherMap =[indexOfTodayInOpenWeatherMap, indexOfTomorrowInOpenWeatherMap, indexOfTomorrowNextInOpenWeatherMap]
  //console.log("indicesInOpenWeatherMap", indicesInOpenWeatherMap)

  // Hitta the index of today
  let dashboard = getDashboardFromLocalStorage();
  //console.log("dashboard in saveWeatherData...", dashboard)
  let dayIndex = 0;
  indicesInOpenWeatherMap.forEach(indexInOpenWeatherMap => {
    dashboard.weatherForecasts[dayIndex].dateTime = weatherData.list[indexInOpenWeatherMap].dt_txt;;
    dashboard.weatherForecasts[dayIndex].weatherIconUrl = `https://openweathermap.org/img/wn/${weatherData.list[indexInOpenWeatherMap].weather[0].icon}@2x.png`;   
    dashboard.weatherForecasts[dayIndex].temperature = weatherData.list[indexInOpenWeatherMap].main.temp;
    dashboard.weatherForecasts[dayIndex].weatherDescription = weatherData.list[indexInOpenWeatherMap].weather[0].description;
    dayIndex = dayIndex + 1;
  })
  //console.log("dashboard with updated weather-info: ",dashboard)
  setDashboardInLocalStorage(dashboard); 
  dashboard = getDashboardFromLocalStorage();
  //console.log("dashboard with updated weather-info: ",dashboard)
};


function getLocation() {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          //console.log("lat, lon: ", lat, lon);
          resolve({ lat, lon });
        },
        error => {
          reject(error); 
          console.log("getCurrentPosition generated an error in the getLocation function.", error.message)
        });
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
};



/* function getLocation() {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          //console.log("lat, lon: ", lat, lon);
          resolve({ lat, lon });
        },
        error => {
          reject(error); 
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    })
  }
};

 */