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
  getFaviconUrl,
  fetchNewsData,
  getDateAndTimeString
}


// BACKGROUND IMAGE
async function fetchImage(searchString){
  let imageUrl ="/images/default-image.jpg";
  if(searchString){
    try{
      const apiKeyResponse = await getApiAccessKeys();
      let ACCESS_KEY = apiKeyResponse.data.unsplash;
      //const url = `https://api.unsplash.com/photos/random?client_id=${ACCESS_KEY}`;
      const url = `https://api.unsplash.com/search/photos?query=${searchString}&client_id=${ACCESS_KEY}`;
      const imageResponse = await axios.get(url)    
      if(imageResponse){
        imageUrl = imageResponse.data.urls.regular; 
      }
    }
    catch(error){
      console.log("Error: Unable to fetch searched random image from Unsplash in fetchImage() function.", error.message)
    }
  } else {
    try{
      const apiKeyResponse = await getApiAccessKeys();
      let ACCESS_KEY = apiKeyResponse.data.unsplash;
      const url = `https://api.unsplash.com/photos/random?client_id=${ACCESS_KEY}`;
      const imageResponse = await axios.get(url)    
      if(imageResponse){
        imageUrl = imageResponse.data.urls.regular; 
      }
    }
    catch(error){
      console.log("Error: Unable to fetch random image from Unsplash in fetchImage() function.", error.message)
    }
  }
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
    console.error("Error: Unable to get ApiAccessKey in getApiAccessKeys() function.", error.message)
  }
}


// DATE & TIME 
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
      console.log("Error: Could not update date or time in updateDateAndTime() function.", error.message)
    }      
}

// DATE & TIME 
  function getDateAndTimeString(dateTime){
    try{
      const myDateTime = new Date(dateTime); 
      const date = myDateTime.toLocaleDateString('sv-SE'); 
      let time = myDateTime.toLocaleTimeString('sv-SE'); 
      time  = time.slice(0, -3);
      return `${date} ${time}`
    } 
    catch(error){
      console.log("Error: Unable to convert dateTime to date and time in getDateAndTimeString(dateTime) function.", error.message)
    }      
}



// WEBLINK  
function getFaviconUrl(websiteMainDomainUrl) {
  try{
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${websiteMainDomainUrl}&sz=256`;
    return faviconUrl;
  }
  catch(error){
    console.log("Error: Unable to get the faviconUrl in getFaviconUrl(websiteMainDomainUrl) function.", error.message)
    const faviconUrl = "/images/default-icon.png";
    return faviconUrl;
  }
}

// WEBLINK 
function extractMainDomainUrl(websiteUrl){
  if(validateWebsiteUrl(websiteUrl)){
    try{
      const urlObject = new URL(websiteUrl);
      const mainDomainUrl = urlObject.hostname;
      return mainDomainUrl;
    } 
    catch(error){
      console.log("Error: Unable to extract main domain url to retrieve the website icon (favicon) in extractMainDomainUrl(websiteUrl) function.", error.message)
    }
  } else {
    alert("Webbadressen verkar innehålla någon felstavning eller saknar någonting. Kopiera gärna webbadressen från hemsidan du vill spara.")
  }
}

// WEBLINK 
function validateWebsiteUrl(websiteUrl) {
  try{
    var urlPattern = /^(https?:\/\/)?([a-z\d.-]+)\.([a-z]{2,})(\/[^\s]*)?$/i;
    return urlPattern.test(websiteUrl);  
  }
  catch (error){
    console.log("Error: Unable to validate website-url in validateWebsiteUrl(websiteUrl) function.", error.message)
  }
}



// WEATHER 
async function fetchWeatherData (cityName, countryCode){
  let dashboard = getDashboardFromLocalStorage();
  let weatherData = null; 
  //console.log("dashboard start of fetchWeatherData()",dashboard)
  try{
    if(cityName !== ""  && countryCode !== ""){
      // get weather for the cityName + countryCode location
      const apiKeysResponse = await getApiAccessKeys();
      let APIkey = apiKeysResponse.data.openWeatherMap;
      const urlCityNameCountryCode = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${APIkey}&units=metric&lang=sv`
      const weatherResponseCityNameCountryCode = await axios.get(urlCityNameCountryCode)
      const weatherDataOfCityNameCountryCode = weatherResponseCityNameCountryCode.data; 
      const lat = weatherDataOfCityNameCountryCode.coord.lat;
      const lon = weatherDataOfCityNameCountryCode.coord.lon;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherDataOfCityNameCountryCode.coord.lat}&lon=${weatherDataOfCityNameCountryCode.coord.lon}&appid=${APIkey}&units=metric&lang=sv`
      APIkey = "";  
      const weatherResponse = await axios.get(url)
      weatherData = weatherResponse.data;
      weatherData.city.coord.lat = lat;
      weatherData.city.coord.lon = lon;
      saveWeatherDataToDashboardAndLocalStorage(weatherData);
    } else {
      // get weather for the user's current Location
      const coords = await getLocation();
      const apiKeysResponse = await getApiAccessKeys();
      let APIkey = apiKeysResponse.data.openWeatherMap;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${APIkey}&units=metric&lang=sv`
      APIkey = "";  
      const weatherResponse = await axios.get(url)
      weatherData = weatherResponse.data;
      saveWeatherDataToDashboardAndLocalStorage(weatherData);
    }
  }
  catch(error){
    console.log("Error: Unable to fetch weather data in fetchWeatherData () function.", error.message)
  }
} 

// WEATHER 
function saveWeatherDataToDashboardAndLocalStorage(weatherData){
  //console.log("weatherData in saveWeatherData...", weatherData)
  let dashboard = getDashboardFromLocalStorage();
  try{
    // Save cityName, countryCode etc
    dashboard.weather.lat = weatherData.city.coord.lat;
    dashboard.weather.lon = weatherData.city.coord.lon;
    dashboard.weather.cityName = weatherData.city.name;
    dashboard.weather.countryCode = weatherData.city.country;

    // Get array-index of today, tomorrow and tomorrow-next
    const dateTimeStringNow = weatherData.list[0].dt_txt;
    const dateTime = new Date(dateTimeStringNow);
    const hoursNow = dateTime.getHours();
  
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
    let dayIndex = 0;
  
    indicesInOpenWeatherMap.forEach(indexInOpenWeatherMap => {
      dashboard.weather.forecasts[dayIndex].dateTime = weatherData.list[indexInOpenWeatherMap].dt_txt;;
      dashboard.weather.forecasts[dayIndex].weatherIconUrl = `https://openweathermap.org/img/wn/${weatherData.list[indexInOpenWeatherMap].weather[0].icon}@2x.png`;   
      dashboard.weather.forecasts[dayIndex].temperature = weatherData.list[indexInOpenWeatherMap].main.temp;
      dashboard.weather.forecasts[dayIndex].weatherDescription = weatherData.list[indexInOpenWeatherMap].weather[0].description;
      dayIndex = dayIndex + 1;
    })
  }
  catch (error){
    console.log("Error: Unable to update dashboard object with weather data in saveWeatherDataToDashboardAndLocalStorage(weatherData) function.", error.message)
  }
  setDashboardInLocalStorage(dashboard); 
  dashboard = getDashboardFromLocalStorage();
};

// WEATHER 
function getLocation() {
  try{
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            resolve({ lat, lon });
          },
          error => {
            reject(error); 
            console.log("getCurrentPosition generated an error in the getLocation() function.", error.message)
          });
      });
    } else {
      console.log("Geolocation is not supported by this browser. A message sent from the getLocation() function.");
    }
  }
  catch(error){
    console.log("Error in getting the location in getLocation() function.", error.message)
  }
};



// NEWS 
async function fetchNewsData (){
  try{
    const apiKeysResponse = await getApiAccessKeys();
    let APIkey = apiKeysResponse.data.newsApi;
    //const url = `https://newsapi.org/v2/top-headlines?country=se&apiKey=${APIkey}`
    //const url = `https://newsapi.org/v2/everything?q=Apple&from=2024-01-21&sortBy=popularity&apiKey=${APIkey}`
    //const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${APIkey}`
    const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${APIkey}`    
    const newsResponse = await axios.get(url)
    const newsData = newsResponse.data; 
    saveNewsDataToDashboardAndLocalStorage(newsData); 
  }
  catch(error){
    console.log("Error in fetching News Data in fetchNewsData() function.", error.message)
  }
} 

// NEWS 
function saveNewsDataToDashboardAndLocalStorage(newsData){
  try{
      let dashboard = getDashboardFromLocalStorage();
      dashboard.newsArticles = [];
      setDashboardInLocalStorage(dashboard); 
      newsData.articles.map(newsItem => {
        dashboard.newsArticles.push({
          id: newsItem.source.id,
          name: newsItem.source.name,
          author: newsItem.author,
          title: newsItem.title,
          description: newsItem.description,
          url: newsItem.url,
          imageUrl: newsItem.urlToImage,
          publicationDate: newsItem.publishedAt,
          content: newsItem.content
        })
      })
      setDashboardInLocalStorage(dashboard); 
    } 
    catch (error){
      console.log("Error in saving news data to dashboard object and local storage.", error.message);
    }
}
