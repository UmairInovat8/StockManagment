Please send the real SOH baseline file in this exact structure:

Warehouse,Location,Article code,Quantity

Rules:
- `Warehouse` should be the branch/store code, for example `STORE-001`.
- `Location` must be the real location code already loaded in the system, for example `FL-4301`.
- `Article code` must be the real SKU/article code from the item master.
- `Quantity` must be the baseline stock-on-hand number for that article at that location.

Important:
- Do not send `0`, blank, or placeholder values in `Article code`.
- The file can be `.csv` or `.xlsx`.
- If the same article appears in multiple locations, keep one row per location/article pair.

Sample rows:

Warehouse,Location,Article code,Quantity
STORE-001,FL-4300,REAL-ARTICLE-CODE-001,10
STORE-001,FL-4301,REAL-ARTICLE-CODE-002,20
