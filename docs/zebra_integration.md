# Feature: Zebra Modular Integration

This branch contains the professional-grade Zebra hardware scanning integration using a modular architecture.

## Key Changes:
- Created a separate `zebra` module in the mobile app.
- Implemented `ZebraProvider` for global hardware intent listening via DataWedge.
- Added `useZebraScanner` hook for clean, event-driven consumption of scan data.
- Built a **Hardware Simulation Mode** to allow testing without a physical device.
- Updated `AuditSession` to support seamless hardware scanning with zero configuration.
