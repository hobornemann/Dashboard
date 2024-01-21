export{
    getDefaultDashboardObject,
    getDashboardFromLocalStorage,
    getDashboardObject,
    setDashboardInLocalStorage
    
}


  // TODO: expand the dashboard object with news-data
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

  

  // TODO: update dashboard with current weather forecasts 
  // TODO: update favicon / FaviconUrl
  async function getDashboardObject(){
    let dashboard;
    const dashboardInLocalStorage = await getDashboardFromLocalStorage();
    //console.log("dashboardInLocalStorage",dashboardInLocalStorage)
    if(dashboardInLocalStorage == null) {
      //console.log("dashboardInLocalStorage == null");
      dashboard = getDefaultDashboardObject();
    } else{
      dashboard = dashboardInLocalStorage;
    }
    setDashboardInLocalStorage(dashboard);  
    return dashboard;
  };
  
  
  function setDashboardInLocalStorage(dashboard){
    try{
      localStorage.setItem("dashboard", JSON.stringify(dashboard));
    } catch (error) {
      console.error("Error setting object in local storage: ", error);
    }
  }
  

  function getDashboardFromLocalStorage(){
    let dashboard = null;
    const localStorageData = localStorage.getItem("dashboard");
    if (localStorageData) {
      try {
        dashboard = JSON.parse(localStorageData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
    return dashboard;
  }
  
  