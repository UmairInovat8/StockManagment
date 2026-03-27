const rowData = {
    "Version: 2.2 Template: Article master file Code": "MRMD-00865-5886642-09658",
    "Alternative Article Code 1": "MRMD-00865",
    "Alternative Article Code 2": "5886642",
    "Alternative Article Code 3": "09658",
    "Alternative": "February 28, 2028",
    "Article Description": "CETRALON 10MG TAB 10S"
  };
  
  const get = (keys) => {
      const clean = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetClean = keys.map(clean);
      const foundKey = Object.keys(rowData).find(k => 
          targetClean.includes(clean(k.trim()))
      );
      return foundKey ? rowData[foundKey] : undefined;
  };
  
  const alt1 = get(['alternative article code 1', 'alt code 1', 'altcode', 'alternativearticlecode1']);
  const alt2 = get(['alternative article code 2', 'alternativearticlecode2']);
  const alt3 = get(['alternative article code 3', 'alternativearticlecode3']);
  
  console.log('ALT1:', alt1);
  console.log('ALT2:', alt2);
  console.log('ALT3:', alt3);
  
  const identifiers = [
      ...(get(['barcode']) ? [{ type: 'BARCODE', value: get(['barcode']) }] : []),
      ...(get(['gtin', 'ean']) ? [{ type: 'GTIN', value: get(['gtin', 'ean']) }] : []),
      ...(get(['alternative article code 1', 'alt code 1', 'altcode', 'alternativearticlecode1']) ? [{ type: 'ALT1', value: get(['alternative article code 1', 'alt code 1', 'altcode', 'alternativearticlecode1']) }] : []),
      ...(get(['alternative article code 2', 'alternativearticlecode2']) ? [{ type: 'ALT2', value: get(['alternative article code 2', 'alternativearticlecode2']) }] : []),
      ...(get(['alternative article code 3', 'alternativearticlecode3']) ? [{ type: 'ALT3', value: get(['alternative article code 3', 'alternativearticlecode3']) }] : []),
  ];
  
  console.log('Identifiers Array:', identifiers);
