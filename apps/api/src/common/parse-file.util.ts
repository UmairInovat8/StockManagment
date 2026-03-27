import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';

/**
 * Shared utility: converts an uploaded file (.xlsx or .csv) into an array of plain row objects.
 * .xlsx is the primary format; .csv is the fallback.
 */
export function parseFileToRows(file: Express.Multer.File): Record<string, any>[] {
    const name = (file.originalname || '').toLowerCase();

    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Scan for actual header row (ignoring metadata titles at top)
        const rawData = XLSX.utils.sheet_to_json<any[]>(firstSheet, { header: 1 });
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(20, rawData.length); i++) {
            const cells = (rawData[i] || []).map(c => String(c).replace(/\s+/g, ' ').trim().toLowerCase());
            const isHeader = cells.some(c => 
                c === 'location' || 
                c === 'warehouse' || 
                c === 'article code' || 
                c === 'item code' || 
                c === 'sku' ||
                c === 'quantity' ||
                c === 'soh' ||
                c === 'stock'
            );
            if (isHeader) {
                headerRowIndex = i;
                break;
            }
        }
        
        // Safety net: if not found, expose the raw grid to debug exactly why
        if (headerRowIndex === -1) {
            const trace = rawData.slice(0, 5).map((row, idx) => `Row${idx}: [${row.join(' | ')}]`).join(' \n');
            const { BadRequestException } = require('@nestjs/common');
            throw new BadRequestException(`Auto-detector could not find headers. Raw sheet top rows:\n${trace}`);
        }

        return XLSX.utils.sheet_to_json(firstSheet, { 
            range: headerRowIndex, 
            defval: '' 
        }) as Record<string, any>[];
    }

    // CSV fallback
    const text = file.buffer.toString('utf-8');
    const lines = text.split(/\r?\n/);
    let headerRowIndex = 0;
    for (let i = 0; i < Math.min(20, lines.length); i++) {
        const lower = lines[i].toLowerCase();
        if (lower.includes('location') || lower.includes('article code') || lower.includes('sku') || lower.includes('warehouse')) {
            headerRowIndex = i;
            break;
        }
    }
    const dataToParse = lines.slice(headerRowIndex).join('\n');
    
    const result = Papa.parse(dataToParse, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim(),
    });
    return result.data as Record<string, any>[];
}

/**
 * Helper: reads a value from a row object, trying multiple possible column names.
 * Matches case-insensitively and ignores leading/trailing spaces in headers.
 * Returns undefined if none match or value is blank / #N/A.
 */
export function getRowValue(row: Record<string, any>, keys: string[]): string | undefined {
    // Normalize row keys once to lowercase, trimmed, with internal newlines/spaces collapsed
    const normalizeString = (str: string) => str.replace(/\s+/g, ' ').trim().toLowerCase();
    
    const normalizedRow: Record<string, any> = {};
    for (const [k, v] of Object.entries(row)) {
        normalizedRow[normalizeString(k)] = v;
    }

    const normalizedSearchKeys = keys.map(normalizeString);

    for (const searchKey of normalizedSearchKeys) {
        const val = normalizedRow[searchKey];
        if (val !== undefined && val !== null && val !== '' && val !== '#N/A') {
            return String(val).trim();
        }
    }
    return undefined;
}
