export{
    getDefaultDashboardObject,
    getDashboardFromLocalStorage,
    getDashboardObject,
    setDashboardInLocalStorage
    
}


  // MODEL
  function getDefaultDashboardObject(){
    
    let dashboard = {
      date: "2023-12-13",
      time: "14:55",
      mainHeading: "My Dashboard",
      webLinks: [
        { 
          id: 1,
          webLinkFaviconUrl: "https://www.google.com/s2/favicons?domain=www.google.se&sz=256",
          webLinkHeading: "Google",
          webLinkUrl: "http://www.google.se",
        },
      ],
      weatherForecasts: [
        {
          dateTime: "",
          weatherIconUrl: "/images/default-icon.png",
          dayHeading: "Idag",
          temperature: -5,
          weatherDescription: "Sol och moln",       
        },
        {
          dateTime: "",
          weatherIconUrl: "/images/default-icon.png",
          dayHeading: "I morgon",
          temperature: -7,
          weatherDescription: "Sol och klart"        
        },
        {
          dateTime: "",
          weatherIconUrl: "/images/default-icon.png",
          dayHeading: "I övermorgon",
          temperature: -10,
          weatherDescription: "Snö och moln"        
        },
      ],
      newsArticles: [
        {
          source: 
          {
            id: "bbc-news",
            name: "BBC News"
          },
          author: "BBC News",
          title: "Man with Alzheimer's pens song to remember wife",
          description: "Mick Smith, a country singer, writes the song for his wife of nearly 60 years, Diana.",
          url: "https://www.bbc.co.uk/news/uk-england-leicestershire-68023459",
          imageUrl: "https://ichef.bbci.co.uk/news/1024/branded_news/C23F/production/_132372794_p0h60l8w.jpg",
          publicationDate: "2024-01-21T09:07:16.5435358Z",
          content: "A man who has recently been diagnosed with Alzheimer's disease has written a song to remember his love for his wife.\r\nMick Smith is a country singer, from Syston in Leicestershire, and performs at de… [+393 chars]"
        }  
      ],
      note: "Här kan du skriva dina anteckningar. Anteckningarna sparas automatiskt.",
    }; 
    return dashboard;
  };

  
  // MODEL 
  async function getDashboardObject(){
    try{
      let dashboard;
      const dashboardInLocalStorage = await getDashboardFromLocalStorage();
      if(dashboardInLocalStorage == null) {
        dashboard = getDefaultDashboardObject();
      } else{
        dashboard = dashboardInLocalStorage;
      }
      setDashboardInLocalStorage(dashboard);  
      return dashboard;
    }
    catch (error){
      console.log("Error when getting the dashboard object in the getDashboardObject() function.", error.message)
    }
  };
  

  // MODEL 
  function setDashboardInLocalStorage(dashboard){
    try{
      localStorage.setItem("dashboard", JSON.stringify(dashboard));
    } catch (error) {
      console.error("Error when setting dashboard object in local storage in the setDashboardInLocalStorage(dashboard) function.", error.message);
    }
  }
  

  // MODEL 
  function getDashboardFromLocalStorage(){
    let dashboard = null;
    let localStorageData = null;
    try{
      localStorageData = localStorage.getItem("dashboard");
    }
    catch (error){
      console.log("Error getting json-data from local storage in getDashboardFromLocalStorage() function.", error.message)
    }

    if (localStorageData) {
      try {
        dashboard = JSON.parse(localStorageData);
      } catch (error) {
        console.error("Error parsing JSON in getDashboardFromLocalStorage() function.", error.message);
      }
      return dashboard;
    } else {
      console.log("Error getting data from local storage in getDashboardFromLocalStorage() function.")
    }
  }
  
  