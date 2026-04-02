import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';

/**
 * Shared utility: converts an uploaded file (.xlsx or .csv) into an array of plain row objects.
 * .xlsx is the primary format; .csv is the fallback.
 */
export function parseFileToRows(file: Express.Multer.File): Record<string, any>[] {
    const name = (file.originalname || '').toLowerCase();

    // Keywords that indicate a header row — broad and fuzzy
    const HEADER_KEYWORDS = ['sku', 'code', 'qty', 'quant', 'stock', 'article', 'item', 'product', 'material', 'barcode', 'gtin', 'location', 'bin', 'warehouse', 'name', 'price', 'uom', 'soh', 'description'];

    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer', cellDates: true });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        const rawData = XLSX.utils.sheet_to_json<any[]>(firstSheet, { header: 1 });
        let headerRowIndex = 0; // Default to row 0
        let maxScore = 0;

        for (let i = 0; i < Math.min(20, rawData.length); i++) {
            const cells = (rawData[i] || []).map((c: any) => String(c).replace(/\s+/g, ' ').trim().toLowerCase());
            const score = cells.reduce((acc: number, c: string) => {
                return acc + HEADER_KEYWORDS.filter(kw => c.includes(kw)).length;
            }, 0);
            if (score > maxScore) {
                maxScore = score;
                headerRowIndex = i;
            }
            if (maxScore >= 3) break; // Strong match found early
        }

        console.log(`[PARSE] Detected XLSX header at row ${headerRowIndex} (score=${maxScore})`);

        return XLSX.utils.sheet_to_json(firstSheet, {
            range: headerRowIndex,
            defval: ''
        }) as Record<string, any>[];
    }

    // CSV fallback
    const text = file.buffer.toString('utf-8');
    const lines = text.split(/\r?\n/);
    let headerRowIndex = 0;
    let maxScore = 0;

    for (let i = 0; i < Math.min(20, lines.length); i++) {
        const lower = lines[i].toLowerCase();
        const score = HEADER_KEYWORDS.filter(kw => lower.includes(kw)).length;
        if (score > maxScore) {
            maxScore = score;
            headerRowIndex = i;
        }
        if (maxScore >= 3) break;
    }

    console.log(`[PARSE] Detected CSV header at row ${headerRowIndex} (score=${maxScore})`);

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
