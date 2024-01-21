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

  // DATE & TIME - GET DATE and TIME
  function getDateAndTimeString(dateTime){
    try{
      
      const myDateTime = new Date(dateTime); 
      const date = myDateTime.toLocaleDateString('sv-SE'); 
      let time = myDateTime.toLocaleTimeString('sv-SE'); 
      time  = time.slice(0, -3);
/* 
      const date =    currentDateTime.getFullYear() + "-"
                      + ((currentDateTime.getMonth() + 1 < 10)?"0":"") 
                      + (currentDateTime.getMonth() + 1 )  + "-" 
                      + ((currentDateTime.getDate() < 10)?"0":"") 
                      + currentDateTime.getDate(); 
      const time =    ((currentDateTime.getHours() < 10)?"0":"")
                      + currentDateTime.getHours() + ":" 
                      + ((currentDateTime.getMinutes() < 10)?"0":"")  
                      + currentDateTime.getMinutes();  */                        
     /*  dashboard.date = date;
      dashboard.time = time; */
      //setDashboardInLocalStorage(dashboard);
      return `${date} ${time}`
    } 
    catch(error){
      console.log("Kunde inte konvertera dateTime till datum och tid", error.message)
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
  
 
  let dashboard = getDashboardFromLocalStorage();
  let dayIndex = 0;
  indicesInOpenWeatherMap.forEach(indexInOpenWeatherMap => {
    dashboard.weatherForecasts[dayIndex].dateTime = weatherData.list[indexInOpenWeatherMap].dt_txt;;
    dashboard.weatherForecasts[dayIndex].weatherIconUrl = `https://openweathermap.org/img/wn/${weatherData.list[indexInOpenWeatherMap].weather[0].icon}@2x.png`;   
    dashboard.weatherForecasts[dayIndex].temperature = weatherData.list[indexInOpenWeatherMap].main.temp;
    dashboard.weatherForecasts[dayIndex].weatherDescription = weatherData.list[indexInOpenWeatherMap].weather[0].description;
    dayIndex = dayIndex + 1;
  })
  setDashboardInLocalStorage(dashboard); 
  dashboard = getDashboardFromLocalStorage();
 };


function getLocation() {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
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


//TODO: TODO: TODO: TODO:
// NEWS - FETCH NEWS DATA
async function fetchNewsData (){
  try{
  const apiKeysResponse = await getApiAccessKeys();
  let APIkey = apiKeysResponse.data.newsApi;
  //const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=API_KEY`
  const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${APIkey}`

  // https://newsapi.org/v2/top-headlines?country=se&apiKey=${APIkey}
  // https://newsapi.org/v2/everything?q=Apple&from=2024-01-21&sortBy=popularity&apiKey=API_KEY
  // https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=API_KEY
  
  APIkey = "";
  //console.log("url news: ", url)
  
  const newsResponse = await axios.get(url)
  console.log("newsResponse: ", newsResponse)
  const newsData = newsResponse.data;  //TODO: checka .data
  console.log("newsData in fetchNewsData", newsData);
  saveNewsDataToDashboardAndLocalStorage(newsData); // TODO:
  }
  catch(error){
    console.log("Error:", error.message)
  }
} 

//TODO: TODO: TODO: TODO: 
function saveNewsDataToDashboardAndLocalStorage(newsData){
  console.log("newsData",newsData);

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
      console.log("Error occurred when saving news data.", error.message);
    }
}
