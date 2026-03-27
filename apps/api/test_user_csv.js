const Papa = require('papaparse');

const csvContent = `"Version:	2.2				
Template:	Article master file				
					
Code"	"Alternative
Article
Code  1"	"Alternative
Article
Code  2"	"Alternative
Article
Code  3"	Alternative	Article Description
MRMD-00865-5886642-09658	MRMD-00865	5886642	09658	February 28, 2028	CETRALON 10MG TAB 10S
MRMD-00001-5631013-07835	MRMD-00001	5631013	07835	October 31, 2027	MUCOLYTE 8MG TABS 20S`;

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

// Add safety check incase there are multiline headers
const headers = rawRows[headerRowIndex].map((h, i) => h ? h.toString().replace(/\n|\r/g, ' ').replace(/\s+/g, ' ').trim() : `Col${i}`);
console.log('Cleaned Headers:', headers);

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
