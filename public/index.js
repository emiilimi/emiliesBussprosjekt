      /**
       * funksjonen henter ut aimed arrival (rutetid) og arrival time (ankomst i sanntid), returnerer som date-objekter.
       * FORELØPIG: Dersom ankomst er null, settes ankomst til avgang. Dette vil fungere for avganger fra første stopp i ruten
       * 
       * @param {Object} datarow - raden som skal behandles   
       * @returns {Array} - array med to date-objekter, aimedArrivalDate og arrivalDate
       */

      function toDateArrival(datarow){ 
        //problemet her er at ankomst settes til avgang dersom ankomst er null. Dette vil funke for avganger fra første stopp, men avganger fra stopp underveis vil ha begge deler. Per nå håndteres ikke dette i tabellfunksjonen. 
        let arrivalDate=null
        if (datarow.arrivalTime === null) {
            if (datarow.departureTime!==null){
              arrivalDate = new Date(datarow.departureTime.value);
            }
            else{
              arrivalDate=null
            }
        } else {
          arrivalDate = new Date(datarow.arrivalTime.value);
        }
        let aimedArrivalDate
        if (datarow.aimedArrivalTime === null) {
            if (datarow.aimedDepartureTime!==null){
              aimedArrivalDate = new Date(datarow.aimedDepartureTime.value);
            }
            else{
              aimedArrivalDate=null
            }
        } else {
          aimedArrivalDate = new Date(datarow.aimedArrivalTime.value);
        }
        return [arrivalDate,aimedArrivalDate]
      }


     
  /**
       * funksjonen regner ut gjennomsnittlig forsinkelse, prosentandel tidlige ankomster, tidligste ankomst og seneste ankomst
       * Fjerner negative forsinkelser (tidlige ankomster) fra listen, og regner ut gjennomsnitt der de tidlige ankomstene settes til null (tidsnok). Logikken bak dette er at gjennomsnittlig forsinkelse ikke skal være null fordi bussen like ofte er forsinket som den kommer tidlig, men vil da ikke fange opp at en buss alltid er tidlig
       * Se litt på hvordan dette kan håndteres bedre/gjøres mer oversiktlig...
       * 
       * @param {Array} data - data som skal behandles
       * @returns {Array} - array med gjennomsnittlig forsinkelse, prosentandel tidlige ankomster, tidligste ankomst og seneste ankomst
       */
      function gjennomsnittligForsinkelse(data){
       
    let tidligeAnkomster=[]
    let utenNegative=[]
    let innenToMinutter=0
    let utenData=[]
    //console.log(data)
    data.forEach(row => {
      //console.log(row)
        const [ankomst, rutetid] = toDateArrival(row);
        const faktiskAnkomst=ankomst
        const deltaMillisekund=faktiskAnkomst-rutetid
        const minutterForsinket=deltaMillisekund/60000
        
        if (minutterForsinket<0){
            tidligeAnkomster.push(minutterForsinket)
            utenNegative.push(0)
        }else if(minutterForsinket<2){
            innenToMinutter++
            utenNegative.push(minutterForsinket)
        }
        else{
            utenNegative.push(minutterForsinket)
        }
       
        //regn ut forsinkelse
        //hvis negativ forsinkelse, håndter (tidlig ankosmt)
        //legg til i liste

    })
    const antAvganger=data.length
    console.log("antall avganger:",antAvganger)
    const snittForsinket = utenNegative.reduce((sum, value) => sum + value, 0) / utenNegative.length;
    const tidligProsent=(tidligeAnkomster.length/utenNegative.length)*100
    const tidligsteAnkomst = Math.min(...tidligeAnkomster);
    const senesteAnkomst = Math.max(...utenNegative);
    console.log("gjenomsnittlig forsinkelse:",snittForsinket)
    console.log("prosentandel tidlige ankomster",tidligProsent,"%")
    console.log("tidligste ankomst var ", tidligsteAnkomst,"før rutetiden")
    console.log("seneste ankomst:", senesteAnkomst, "etter rutetid")
    console.log("innen to minutter: ",innenToMinutter)
    return([snittForsinket,tidligProsent,tidligsteAnkomst,senesteAnkomst])
    //regn ut gjennomsnittlig forsinkelse, samt andel avganger som kommer for tidlig. 
    //returner gjennomsnittlig forsinkelse, prosentandel tidlige ankomster, tidligste ankomst (min(tidlige ankoster), seneste ankomst (max(forsinkelser)))
}//prosentandel avganger som er forsinket?? og gjennomsnitt for alle avgangene, men for tidlig teller ikke positivt. 

    // Fetch data from the server (this assumes your Express server is running on localhost)
    async function fetchData() {
      try {
        const response = await fetch('/alleRuter'); // Assuming the data is available at '/data' endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
  
        // Call the function to generate the table with data
        //generateTable(data);
        // Import the gjennomsnittligForsinkelse function from an external file
       
        let [a,b,c,d]=(gjennomsnittligForsinkelse(data));
        console.log(a)
        console.log(b)
        console.log(c)
        console.log(d)  

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    // Function to generate a table
    function generateTable(data) {
      // Create a table element
      const table = document.createElement('table');
      table.setAttribute('border', '1');
  
      // Create the table header
      const headerRow = document.createElement('tr');
      const lineRefHeader = document.createElement('th');
      lineRefHeader.textContent = 'Line Ref';
      const stopPointRefHeader = document.createElement('th');
      stopPointRefHeader.textContent = 'Stop Point Ref';
      const stopPointNameHeader = document.createElement('th');
      stopPointNameHeader.textContent = 'Stop Point Name';
      const aimedDepartureTimeHeader = document.createElement('th');
      aimedDepartureTimeHeader.textContent = 'Aimed Departure Time';
      const departureTimeHeader = document.createElement('th');
      departureTimeHeader.textContent = 'Departure Time';
      const aimedArrivalTimeHeader = document.createElement('th');
      aimedArrivalTimeHeader.textContent = 'Aimed Arrival Time';
      const arrivalTimeHeader = document.createElement('th');
     
      arrivalTimeHeader.textContent = 'Arrival Time';
      const diffDateHeader = document.createElement('th');
      diffDateHeader.textContent = 'Delay';
      const dayOfTheWeekHeader = document.createElement('th');
      dayOfTheWeekHeader.textContent = 'Day of the Week';
  
      // Append header cells to header row
      headerRow.appendChild(lineRefHeader);
      headerRow.appendChild(stopPointRefHeader);
      headerRow.appendChild(stopPointNameHeader);
      headerRow.appendChild(aimedDepartureTimeHeader);
      headerRow.appendChild(departureTimeHeader);
      headerRow.appendChild(aimedArrivalTimeHeader);
      headerRow.appendChild(arrivalTimeHeader);
      headerRow.appendChild(diffDateHeader);
      headerRow.appendChild(dayOfTheWeekHeader);
      table.appendChild(headerRow);
      let diffDates=[]
  
      // Create a row for each item in the data
      data.forEach(row => {
        console.log(row)
        const tableRow = document.createElement('tr');
  
        const lineRefCell = document.createElement('td');
        lineRefCell.textContent = row.lineRef;  // lineRef
        const stopPointRefCell = document.createElement('td');
        stopPointRefCell.textContent = row.stopPointRef;  // stopPointRef
        const stopPointNameCell = document.createElement('td');
        stopPointNameCell.textContent = row.stopPointName;  // stopPointName
        const aimedDepartureTimeCell = document.createElement('td');
        aimedDepartureTimeCell.textContent = row.aimedDepartureTime;  // aimedDepartureTime
        const departureTimeCell = document.createElement('td');
        departureTimeCell.textContent = row.departureTime;  // departureTime


        const aimedArrivalTimeCell = document.createElement('td'); 
        const arrivalTimeCell = document.createElement('td');

       

        const [arrivalDate,aimedArrivalDate]=toDateArrival(row)
        aimedArrivalTimeCell.textContent = aimedArrivalDate;  // aimedArrivalTime
        arrivalTimeCell.textContent = arrivalDate;  // arrivalTime
        // if (row.aimedArrivalTime === null) {
        //     if (row.aimedDepartureTime!==null){
        //      aimedArrivalDate = new Date(row.aimedDepartureTime.value);
        //       aimedArrivalTimeCell.textContent = aimedArrivalDate;  // aimedArrivalTime
        //     }
        //     else{
        //       aimedArrivalTimeCell.textContent = 'Not available';
        //       aimedArrivalDate=null
        //     }
        // } else {
        //   aimedArrivalDate = new Date(row.aimedArrivalTime.value);
        //   aimedArrivalTimeCell.textContent = aimedArrivalDate;  // aimedArrivalTime
        // }
       
        // 
        // if (row.arrivalTime === null) {
        //     if (row.departureTime!==null){
        //       arrivalDate = new Date(row.departureTime.value);
        //       arrivalTimeCell.textContent = arrivalDate;  // arrivalTime
        //     }
        //     else{
        //       arrivalTimeCell.textContent = 'Not available';
        //       arrivalDate=null
        //     }
        // } else {
        //   arrivalDate = new Date(row.arrivalTime.value);
        //   arrivalTimeCell.textContent = arrivalDate;  // arrivalTime
        // }



        const diffDateCell = document.createElement('td');
        if(aimedArrivalDate!==null && arrivalDate!==null){
          let timeDifference = arrivalDate - aimedArrivalDate;
       //console.log("Før omregning: ", timeDifference)
       timeDifference=(timeDifference/1000)/60
       //console.log("Etter omregning; ", timeDifference)
        diffDates.push(timeDifference);
        diffDateCell.textContent=timeDifference
      
        } else {
          diffDateCell.textContent = 'Not available';
        }
       // Calculate the difference in milliseconds
       
                
        const dayOfTheWeekCell = document.createElement('td');
        dayOfTheWeekCell.textContent = row.dayOfTheWeek;  // dayOfTheWeek
  
        // Append each cell to the row
        tableRow.appendChild(lineRefCell);
        tableRow.appendChild(stopPointRefCell);
        tableRow.appendChild(stopPointNameCell);
        tableRow.appendChild(aimedDepartureTimeCell);
        tableRow.appendChild(departureTimeCell);
        tableRow.appendChild(aimedArrivalTimeCell);
        tableRow.appendChild(arrivalTimeCell);
        tableRow.appendChild(diffDateCell);
        tableRow.appendChild(dayOfTheWeekCell);
        
        // Append the row to the table
        table.appendChild(tableRow);
      });
  
      // Append the table to the table container in the HTML
      const tableContainer = document.getElementById('table-container');
      tableContainer.innerHTML = '';  // Clear any existing content
      tableContainer.appendChild(table);
      const meanDelay= (diffDates.reduce((sum, date) => sum + date, 0) / diffDates.length);
  
      console.log(`Mean delay in minutes: ${meanDelay}`);


  

    }
    
    // Fetch the data when the page is loaded
    fetchData();


