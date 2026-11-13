export const fields=['category','topic','travelport','amadeus','sabre','keywords','description'];
// Screenshot-derived preview records only; replace with reviewed backend records.
const examples=[
['Encode','City','.CE PEORIA','DANPEORIA','W/-CCPEORIA'],
['Encode','Airline','.AE AIR CANADA','DNAAIRCANADA','W/-ALAIR CANADA'],
['Encode','Country','.LE JAPAN','DCJAPAN','HCCC/JAPAN'],
['Encode','Car company','GC*12/CAR/BUDGET','DNCBUDGET','W/-CRBUDGET'],
['Encode','Hotel company','GC*11/HTL/RAMADA','DNHRAMADA','W/-HLRAMADA'],
['Encode','Help','H/ENCO','',''],
['Decode','City','.CD NYC','DACPIA','W/*PIA'],
['Decode','Airline','.AD EI','DNAAC','W/*AC'],
['Decode','Country','.LD AU','DCJP','HCCC/JP'],
['Decode','Car company','GC*12/CAR/ZD','DNCZD','W/CR*ZD'],
['Decode','Hotel company','C*HTL/RA','DNHRA','W/HL*RA'],
['Decode','Help','H/DECO','',''],
['Miscellaneous','Decode aircraft types','.ED76W 76W J BOEING 767-300 (WINGLETS) PASSENGER H/AIRC','DNE747','W/EQ*747']
];
export const seed=examples.map(([category,topic,travelport,amadeus,sabre],i)=>({id:`preview-${i}`,category,topic,travelport,amadeus,sabre,keywords:`${category} ${topic}`,description:''}));
