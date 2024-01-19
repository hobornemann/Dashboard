
FRÅGOR TILL SANDRA

1.  Brukar det bli undefined-problem när man instantierar ett globalt dashboard-object som sedan används på diverse ställen av olika funktioner (potentiellt samtidigt)?
    - Dvs ska man istället för JS-objektet alltid hämta data från localStorage-objectet istället för JS-objektet? 

2.  Behöver man köra async-await när man sparar dashboard i setDashboardInLocalStorage ? (så att inte någon annan funktion försöker hämta dashboard från localStorage precis under den processen)?

(3)  Vad är skillnaden mellan:
          const myWebLinksArray = dashboard.webLinks.filter(webLink => webLink.id !== webLinkId);  // fungerade inte
          const myWebLinksArray = dashboard.webLinks.filter(webLink => !(webLink.id == webLinkId)); // fungerade bra
Svar:  webLinkId var en sträng, medan webLink.id var en integer !!!! parseInt() av webLinkId hade funkat bra 

4. 

