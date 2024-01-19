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
  getDateAndTime,
  fetchWeatherData,
  getLocation
}




// TODO: get Favicons via google's url
// WEBLINKS - GET FAVICON-URLs
async function getFavicon(){

  try{

    return ""  // TODO:
  }
  catch(error){
    console.error("Favicon could not be retrieved", error.message)
    return "./images/default-icon.png"
  }
}


// BACKGROUND IMAGE - GET IMAGE-URL 
async function fetchImage(){
    let imageUrl ="/images/default-image.jpg";
    const response = await getApiAccessKeys();
    const ACCESS_KEY = response.data.unsplash;
    console.log("ACCESS_KEY unsplash",ACCESS_KEY)
    const url = `https://api.unsplash.com/photos/random?client_id=${ACCESS_KEY}`;
      try{
        // const response = await axios.get(url)    //TODO: UNCOMMENT THIS LINE WHEN FINISHED
        if(response){
          imageUrl = response.data.urls.regular; 
        }
      }
      catch(error){
        console.log("Error", error.message)
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
      console.error("Error", error.message)
    }
    /* const accessKeys = fetch('./apiAccessKeys.json')
        .then((response) => response.json()); */
  }
  
  
  
  // DATE & TIME - GET DATE and TIME
  function getDateAndTime(){

    try{
      let dashboard = getDashboardFromLocalStorage();
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
      return true
      //console.log("dashboard in getDateAndTime: ", dashboard)

    } catch(error){
      console.log("Error", error.message)
    }
  
  };
  

  
// WEATHER - FETCH WEATHER DATA
async function fetchWeatherData (){

  try{
  const coords = await getLocation();
  console.log("coords", coords)
  const apiKeysResponse = await getApiAccessKeys();
  const APIkey = apiKeysResponse.data.openWeatherMap;
  console.log("APIkey weather: ", APIkey)
  //const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric&lang=SE`
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${APIkey}&units=metric`
  console.log("url weather: ", url)
  // https://api.openweathermap.org/data/2.5/forecast?lat=59.2583266&lon=18.0834523&appid=51faa6f37756f34fb7074772eb5210f0&units=metric
  
    const weatherResponse = await axios.get(url)
    console.log("weatherResponse: ",weatherResponse)
    const weatherData = weatherResponse.data;
    console.log("weatherData",weatherData);

    saveWeatherDataToDashboardAndLocalStorage(weatherData); 
  }
  catch(error){
    console.log("Error:", error.message)
    //alert
  }
} 

function saveWeatherDataToDashboardAndLocalStorage(weatherData){
  
  // Get array-index of today, tomorrow and tomorrow-next (at 12.00 hours, or now if now is after 12.00 hours)
  console.log("weatherData",weatherData) 

  const dateTimeStringNow = weatherData.list[0].dt_txt;
  console.log("weatherData.list[0].dt_txt",weatherData.list[0].dt_txt) 
  const dateTime = new Date(dateTimeStringNow);
  console.log("dateTime",dateTime)
  const hoursNow = dateTime.getHours();

  console.log("hourNow",hoursNow)
  
  
  
  let indexOfToday = null;
  let indexOfTomorrow = null;
  let indexOfTomorrowNext = null;

  if (hoursNow < 12){
    indexOfToday = (12-hoursNow)/3;
    indexOfTomorrow = indexOfToday + (24/3);
    indexOfTomorrowNext = indexOfTomorrow + (24/3);
  } else {
    indexOfToday = 0;
    indexOfTomorrow = indexOfToday + (24-hoursNow)/3 + (12/3);
    indexOfTomorrowNext = indexOfTomorrow + (24/3);
  }

  const days =[indexOfToday, indexOfTomorrow, indexOfTomorrowNext]
console.log("days",days)

  // Hitta the index of today
  let dashboard = getDashboardFromLocalStorage();

  days.forEach(index =>{
    dashboard.weatherForecasts[index].dateTime = weatherData.list[index].dt_txt;
    dashboard.weatherForecasts[index].weatherIconUrl = `https://openweathermap.org/img/wn/${weatherData.list[index].weather[0].icon}@2x.png`;   
    dashboard.weatherForecasts[index].temperature = weatherData.list[index].main.temp;
    dashboard.weatherForecasts[index].weatherDescription = weatherData.list[index].weather[0].description;
  })
  
  setDashboardInLocalStorage(dashboard); 
};


function getLocation() {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log("lat, lon: ", lat, lon);
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


