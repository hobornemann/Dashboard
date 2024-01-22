
FRÅGOR TILL SANDRA

1.  Brukar det bli undefined-problem när man instantierar ett globalt dashboard-object som sedan används på diverse ställen av olika funktioner (potentiellt samtidigt)?
    - Dvs ska man istället för JS-objektet alltid hämta data från localStorage-objectet istället för JS-objektet? 

2.  Behöver man köra async-await när man sparar dashboard i setDashboardInLocalStorage ? (så att inte någon annan funktion försöker hämta dashboard från localStorage precis under den processen)?

(3)  Vad är skillnaden mellan:
          const myWebLinksArray = dashboard.webLinks.filter(webLink => webLink.id !== webLinkId);  // fungerade inte
          const myWebLinksArray = dashboard.webLinks.filter(webLink => !(webLink.id == webLinkId)); // fungerade bra
Svar:  webLinkId var en sträng, medan webLink.id var en integer !!!! parseInt() av webLinkId hade funkat bra 

4. Behöver man både new Promise med resolve-reject och try-catch? Eller, är resolve-reject en typ av error handler redan?
    - se tex funktionen getLocation i fetchData.js. Behöver man lägga till en try-catch här? Det verkar som att det redan finns tillräcklig error handling...
    - Eller, behöver man skapa en try-catch för varje funktion man kallar på?
    - Eller, räcker det med / ska man ha en try-catch i varje kod som innehåller minst en funktion 

5. Om man har try-catch på alla funktioner som ingår i en annan funktion, behöver man även ha try-catch för den övergripande funktionen, eller räcker det med att det finns try-catch på alla underliggande funktioner?

6. 

