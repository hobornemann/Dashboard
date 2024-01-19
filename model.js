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
          webLinkFaviconUrl: "/images/default-icon.png",
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
        }
      ],
      news: [
  
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
    if(dashboardInLocalStorage == null) {
      console.log("dashboardInLocalStorage == null");
      dashboard = getDefaultDashboardObject();
    } else{
      dashboard = dashboardInLocalStorage;
    }
    setDashboardInLocalStorage(dashboard);
    return dashboard;
  };
  
  
  function setDashboardInLocalStorage(dashboard){
    localStorage.setItem("dashboard", JSON.stringify(dashboard));
  }
  
  function getDashboardFromLocalStorage(){
    let dashboard = JSON.parse(localStorage.getItem("dashboard"));
    return dashboard;
  }
  
  