# StockCount Manager by athgadlang

A premium, multi-page inventory management system with Admin Web, Backend API, and Android Auditor app.

## Assumptions & Prerequisites
- **Node.js**: v18+
- **Docker**: For PostgreSQL database
- **Android Studio**: For Android execution
- **npm**: Preferred package manager

## 1. System Infrastructure
Run the database using Docker:
```bash
docker compose up -d
```

## 2. Backend API Setup
```bash
cd apps/api
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```
*Note: Seeding includes 2000 items, 8 auditors, and 1 manager/architect.*

## 3. Admin Web Setup (Overhauled)
```bash
cd apps/admin-web
npm install
npm run dev
```
- **Login**: `manager@athgadlang.com`
- **Password**: `athgadlang123`
- **Modules**: Dashboard (Real metrics), Branches, Users, Locations (Hierarchy), Item Master (2k items), Audits, Reporting, Sys Logs.

## 4. Auditor Android Setup
Note: Mobile environments require local native folder generation.
```bash
cd apps
npx react-native init auditor_android --version 0.72.6
# Copy implemented logic from original source if needed
cd auditor-android
npm install --legacy-peer-deps
npx react-native start
npx react-native run-android
```
- **Offline Logic**: Uses SQLite for event queuing.
- **Sync**: Automatically batches events to the backend with client-side UUID idempotency.
- **UI**: Includes offline status banners and branding by athgadlang.

## 5. Verification Steps
1. **Admin**: Navigate to `http://localhost:5173`. Expect professional dark-themed Login.
2. **Dashboard**: Verify the "StockCount Velocity" chart and activity logs.
3. **Master Data**: Check "Item Master" to see 2000 items successfully synced from the DB.
4. **Logs**: View "System Audit Logs" for audit trail transparency.
