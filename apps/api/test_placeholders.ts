
import { randomUUID } from 'crypto';

async function testPlaceholders() {
    const batchSize = 3;
    const itemValues = [];
    for (let i = 0; i < batchSize; i++) {
        itemValues.push([
            randomUUID(), `SKU_${i}`, `Name ${i}`, 'Brand', 'GTIN', 'Batch',
            'Barcode', 'QR', 'Serial', null,
            10.5, 'EA',
            new Date().toISOString(), new Date().toISOString(),
            JSON.stringify({ f: 'm' }),
            randomUUID(), randomUUID(), new Date().toISOString(), new Date().toISOString()
        ]);
    }

    let vIdx = 1;
    const placeholders = itemValues.map(() =>
        `($${vIdx++}::uuid,$${vIdx++},$${vIdx++},$${vIdx++},$${vIdx++},$${vIdx++},$${vIdx++},$${vIdx++},$${vIdx++},$${vIdx++},$${vIdx++}::float,$${vIdx++},$${vIdx++}::timestamp,$${vIdx++}::timestamp,$${vIdx++}::jsonb,$${vIdx++}::uuid,$${vIdx++}::uuid,$${vIdx++}::timestamp,$${vIdx++}::timestamp)`
    ).join(',');

    console.log('Query fragment samples:');
    console.log(placeholders.substring(0, 500));
    
    const flat = itemValues.flat();
    console.log('Total parameters:', flat.length);
    console.log('Last placeholder index expected:', batchSize * 19);
    console.log('Actual vIdx - 1:', vIdx - 1);
}

testPlaceholders();
