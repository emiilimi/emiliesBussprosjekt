function gjennomsnittligForsinkelse(datajson){
    let tidligeAnkomster=[]
    let utenNegative=[]
    let innenToMinutter
    for (let row in data){
        const rutetid=new Date(row.aimedArrivalTime)
        const faktiskAnkomst=new Date(row.arrivalTime)
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

    }
    const snittForsinket= mean(utenNegative)
    const tidligProsent=(tidligeAnkomster.length()/utenNegative.length)*100
    const tidligsteAnkomst=min(tidligeAnkomster)
    const senesteAnkomst=max(utenNegative)
    return(snittForsinket,tidligProsent,tidligsteAnkomst,senesteAnkomst)
    //regn ut gjennomsnittlig forsinkelse, samt andel avganger som kommer for tidlig. 
    //returner gjennomsnittlig forsinkelse, prosentandel tidlige ankomster, tidligste ankomst (min(tidlige ankoster), seneste ankomst (max(forsinkelser)))
}//prosentandel avganger som er forsinket?? og gjennomsnitt for alle avgangene, men for tidlig teller ikke positivt. 
