const Papa = require('papaparse');

const csvContent = `"Version:","2.2","","","","","","","","","","","","","",""
"","","","","","","","","","","","","","","",""
"Article code";"Alternative Article Code 1";"Alternative Article Code 2";"Alternative Article Code 3";"Alternative";"Article Description";"UOM";"Article Category 1";"Article Category 2";"Article Category 3";"Article Value (per unit)";"Countit Family";"Behaviour";"Description";"Col14";"Col15"
"MRMD-00865-5886642-09658";"MRMD-00865";"5886642";"09658";"2028-02-27T18:59:48.000Z";"CETRALON 10MG TAB 10S";"EA";"MEDS";"";"";"12.5";"DRUGS";"Normal";"";"";""`;

const results = Papa.parse(csvContent, { 
    header: false, 
    skipEmptyLines: 'greedy',
    dynamicTyping: false,
    delimiter: ""
});

const rawRows = results.data;
const standardKeywords = ['sku', 'code', 'name', 'article', 'gtin', 'barcode', 'price'];
let headerRowIndex = 0;
let maxMatches = -1;

for (let R = 0; R < Math.min(rawRows.length, 20); R++) {
    let matches = 0;
    const row = rawRows[R];
    for (let C = 0; C < row.length; C++) {
        const cell = row[C];
        if (cell) {
            const val = cell.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
            if (standardKeywords.some(k => val.includes(k))) matches++;
        }
    }
    if (matches > maxMatches) {
        maxMatches = matches;
        headerRowIndex = R;
    }
    if (maxMatches >= 3) break;
}

console.log('Detected Header Row:', headerRowIndex);

const headers = rawRows[headerRowIndex].map((h, i) => h ? h.toString().trim() : `Col${i}`);
console.log('Headers:', headers);

const allRows = [];
for (let r = headerRowIndex + 1; r < rawRows.length; r++) {
    const rowArr = rawRows[r];
    const rowObj = {};
    let hasData = false;
    for (let c = 0; c < rowArr.length; c++) {
        if (rowArr[c] !== undefined && rowArr[c] !== null && rowArr[c] !== '') {
            rowObj[headers[c] || `Col${c}`] = rowArr[c];
            hasData = true;
        }
    }
    if (hasData) allRows.push(rowObj);
}

console.log('Parsed Rows (First 1):', JSON.stringify(allRows.slice(0, 1), null, 2));
