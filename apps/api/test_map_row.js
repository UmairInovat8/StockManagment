const rowData = {
  "Article code": "MRMD-00865-5886642-09658",
  "Alternative Article Code 1": "MRMD-00865",
  "Alternative Article Code 2": "5886642",
  "Alternative Article Code 3": "09658",
  "Alternative": "2028-02-27T18:59:48.000Z",
  "Article Description": "CETRALON 10MG TAB 10S"
};

const get = (keys) => {
    const clean = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const targetClean = keys.map(clean);
    
    console.log(`Checking against: ${targetClean}`);
    console.log(`Available Keys: ${Object.keys(rowData).map(k => clean(k.trim()))}`);
    
    const foundKey = Object.keys(rowData).find(k => 
        targetClean.includes(clean(k.trim()))
    );
    return foundKey ? rowData[foundKey] : undefined;
};

const sku_code = get(['sku_code', 'item_code', 'code', 'sku', 'product_code', 'articleno', 'article_no', 'articlecode', 'itemid', 'item_id', 'productcode', 'skuid', 'productid', 'item_no', 'itemno']);
console.log('SKU Code Extracted:', sku_code);
