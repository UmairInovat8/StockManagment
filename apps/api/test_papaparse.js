const Papa = require('papaparse');

const csvContent = `"Article code";"Alternative Article Code 1";"Alternative Article Code 2";"Alternative Article Code 3";"Alternative";"Article Description";"UOM";"Article Category 1";"Article Category 2";"Article Category 3";"Article Value (per unit)";"Countit Family";"Behaviour";"Description";"Col14";"Col15"
"MRMD-00865-5886642-09658";"MRMD-00865";"5886642";"09658";"2028-02-27T18:59:48.000Z";"CETRALON 10MG TAB 10S"`;

const results = Papa.parse(csvContent, { 
    header: true, 
    skipEmptyLines: 'greedy',
    dynamicTyping: false,
    transformHeader: (h) => h.trim() 
});

console.log('Parsed Rows:');
console.log(JSON.stringify(results.data, null, 2));

if (results.errors.length > 0) {
    console.log('Errors:');
    console.log(JSON.stringify(results.errors, null, 2));
}
