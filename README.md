# Project DASHBOARD

## Table of Contents

1. About the Project
   - purpose
2. Built With
3. Getting Started
   - Prerequisites
   - Installation
4. Description and Usage
5. Roadmap
6. Contributing
7. Licences
8. Contact
9. Acknowledgements

## 1. About the Project

### Purpose

The purpose of this web application is to provide the user with an all-in-one start page that:
a) gives users a quick update on the weather forecast and top international news stories
b) provides them with short-cut navigation to their favourite web pages
c) gives them quick & convenient access to a place where the user can make notes.


## 2. Built With

HTML
CSS
JavaScript
npm
Vite
Axios
GitHub

## 3. Getting Started

### Prerequisites

1. An IDE like e.g. VS Code or IntelliJ
2. Node.js, npm, Vite, Axios
3. Web browser, e.g. Google Chrome.
4. The HTML-documents requires links to the following style-sheet and javascript-file.
<link rel="stylesheet" href="/style.css">
<script type="module" src="/main.js" defer></script>
5. Access to https://github.com/hobornemann/Dashboard 

### Installation

1. The project is temporarily public. 
2. Once access has been provided, log in to GitHub and clone the project:
   https://github.com/hobornemann/Dashboard
3. Make sure that any new html-pages include the following css-links and javascript-links:
<link rel="stylesheet" href="/style.css">
<script type="module" src="/main.js" defer></script>
4. Launching the web application: In VS Code, standing in the Terminal window, you type: npm run dev
Ctrl+click on the link http://localhost:xxxx/
The application opens in your web browser.
If you try to open the application in the Live Server, it will not work. 
The package.json needs to include the following two dependencies (or later versions thereof): 
  "devDependencies": {
    "vite": "^5.0.8"
  },
  "dependencies": {
    "axios": "^1.6.5"
  } 
5. Api Access Keys: 
To be able to use the Dashboard application, you need to have/get a free personal API Access Key from the following data providers:

https://unsplash.com/
https://openweathermap.org/
https://newsapi.org/

The API access keys need to be copied into json-file called apiAccessKeys.json in the following way: 
{
    "unsplash": "your personal Api access key to unsplash",
    "openWeatherMap": "your personal Api access key to openWeatherMap",
    "newsApi": "your personal Api access key to newsApi" 
}


## 4. Description and Usage

### Description

The web application is a single-page application that provides the user with:
a) quick access to weather forecast and top international news stories
b) short-cut navigation to web pages the user has chosen 
c) quick & convenient access to a place where the user can make notes.

The application is responsive and can be used on desktops, tablets and mobile phones.

### Usage

1. Validation:
   The app validates:
- that a web-adress provided by the user for a short-cut web link is correctly formatted
- that the number of web links is not higher than can be shown in the container provided for web link short-cuts
 

2. Show/hide:

- When the user wants to add a new web link, a dialog box appears with two input-fields.In the first one, the user inserts the url to the new website. In the second one, the user provides a name to the website. When done, the user clicks the OK- or the Cancel-button. The dialog box disappears when a button has been clicked.  


3. User Interaction / Communication:

- Should the user insert a faulty url, a popup alert appears and explains that the provided web address was not fully correct. The alert provides info on what the user may have missed when inserting the url.


### Code

The code/mark-up can be found in the following files:

HTML:                               index.html
CSS:                                style.css
Rendering HTML and EventListeners:  main.js
Dashboard object & Local Storage:   model.js
Data-fetch functions:               fetchData.js
API-access keys:                    apiAccessKeys.json
README:                             README.md
Dependencies:                       package.json
Package-lock:                       package-lock.json
Files to ignore for Git:            .gitignore
Images:                             Images-folder

Files starting with a "z":          Please ignore. Educational/personal files only (which would not be included in a real project situation).
   


The default dashboard object (which is also stored in local storage) looks as follows: 

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


    The window-onload function looks as follows. After the data has been fetched from the internal dashboard object as well as the external data providers of weather forecasts, news etc, the webpage is rendered and the date and clock of the webpage is set on an interval to be continuously updated. 

    // WINDOW  
window.addEventListener("DOMContentLoaded", async () => { 
  try{
    // localStorage.setItem("dashboard", null); 
    let dashboard =  await getDashboardObject();
    await fetchWeatherData()
    await fetchNewsData();
    renderDynamicElementsOfIndexPage();
    renderIntialBackgroundImage();
    setInterval(renderDateAndTime, 100000);  
  }
  catch(error){
    console.log("Error in window.addEventListener function. ", error.message)
  }
});

The renderDynamicElementsOfIndexPage is including functions that will render the different parts of the webpage:

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

The typical structure of the rendering functions can be seen in the below example. First, the necessary data is fetched. Second, the dynamic HTML is created and inserted into the webpage. Third, any necessary event listeners are added to the HTML-elements that have just been created. 

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



### Code Review 

In this section, I will provide some comments on the code, i.e. what I perceive to be the strengths and weaknesses. 

1. Strengths

a) MVC-inspired Module Structure: 

=> Model: 
> This application has a backend in the form of 
  a localStorage object (model.js) and the accessible databases of the API-providers (fetchData.js).

=> View: 
> the single-page HTML-document (index.html) only contains structural elements. It neither contains any styles nor any functionality. The dynamic parts of the web page are generated dynamically to fit data-items fetched from localStorage or the API-providers.
> all styles are included in one file (style.css). Elements that belong to each other are grouped together (weblinks, weather forecasts, news articles, notes). 

=> Controller:
> all event listeners are located in one file (main.js). Event listeners that are related to each other are also grouped together. 

b) Naming:
> HTML-elements, JS-objects/variables and functions have been given names that enable other developers to understand the code. This will make it easy and fast for other developers to maintain and/or improve. 

c) Refactoring
> All code that is related to fetching data from local storage or from external data providers via API has been refactored into separate functions. 
> The rendering functions that require the rendering of dynamic HTML and the dynamic creation of event listeners have intentionally not been refactored into sub-functions. 

d) Error handling 
> all functions and event-listeners have been equipped with try-catch for error handling in order to catch errors at the source.
> With a few intentional exceptions (the rendering functions), functions have been limited to only serve one purpose. Including try-catch error handling in each function makes sure that errors are caught at the source where they occur.  
> However, the area of error handling is probably much larger than I have knowledge about at this point. Thus, error handling has also been listed as a weakness.

e) Validation of user input
> The code contains at least a basic form of validation of user-input as regards the creation of new web links (checking that the input has the format of a valid website address, that the main domain can be extracted from the website address and that the number of web-links does not exceed the number that can be displayed on the web page).

f) API access keys
> The API-Access Keys are stored in a separate json-file, which has been excluded from the GitHub repo via the dot-gitignore-file. 

g) Responsive design
> By using css' clamis in English  feature for specifying font-size, height etc of certain HTML-elements, I have achieved a design that is dynamically responsive, i.e. that dynamcially and gradually adjusts the design to the type and size of the user's device (rather than the stepwise responsive design that media-queries can achieve). The advantage of using clamp is that it will work on any and all new device-sizes that manufacturers may come up with.


2. Weaknesses

a) Testing:
> The application has not been properly tested. The project lacks both unit tests and proper UI-test.

b) Security
> The application has not been checked or tested from a security perspective at all. 

c) Accessibility:
> The application has only been subject to minimal accessibility tests, e.g. checking what happens to the page when the user increases the font-size. 
> No alt-texts have been added to the images retrieved from the external data providers

d) Long names:
> unless you use special software to shrink the size of the application, longer names has the disadvantage of making the application larger than needs to be from a performance perspective. However, performance should not be an issue for this application. The clarity of code aspect is more important in this case.    

e) Error handling:
> The area of error handling is probably much larger than I have knowledge to include into this project. Thus, error handling is probably also a major weakness of the project at this point.

f) Limits on free data
> There is a limit on the number of images that the user may retrieve from Unsplash per unit of time. This limit has been handled by applying a default background image that is displayed when the limit has been reached.
> There may potentially be corresponding limits on data retrieval from the other data providers.   

g) Language
> The app is targeting a Swedish speaking audience only. 
> The news feed from BBC is in English only. 


## 5. Roadmap 

For the time being, there are no plans to extend, update or permanently publish the application. It only serves as a solution to an educational assignment. 


## 6. Contributing

Any suggestions for improvements, further developments of the project or other contributions are more than welcome.

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 7. Licences

No licences are required for development or publication of this web application. VS Code, Node.js, Axios, Vite, GitHub as well as the three data providers Unsplash, NewsApi and OpenWeatherMap offer free downloads / free accounts. The web application has not been published on any external web site yet.

## 8. Contact

Project assignment designed by:
Sandra Larsson
Sandra.Larsson@ChasAcademy.se

Project developed by:
Hans-Olov Bornemann
hans-olov.bornemann@chasacademy.se

Project-link:
https://github.com/hobornemann/Dashboard

## 9. Acknowledgements

Many thanks to Sandra Larsson for providing the project specification, description of required functionality as well as the design guidelines of this application.

Thanks also to the following communities/organisations/companies for providing open source and/or free version of their services/products:

Unsplash
OpenWeatherMap
NewsAPI
Developer.Mozilla.org
W3 School
Stack Overflow
SheCodes.io
GitHub
Microsoft










# PROJECT STRUCTURE





ERROR-HANDLING

No Network available error:
> 

API-Calls :
> default variants
> messages



User-input:>
> validation of usr input
> security aspects


User-interaction:
> double-clicks ?



Future Maintenance & Development:
> Need to make sure that id-numbers are universal for the document

