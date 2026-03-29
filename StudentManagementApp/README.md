# Student Management (Expo / React Native)

Mobile client for the ASP.NET **StudentManagement.Api** (JWT + SQLite). Login defaults match the API: username **`admin`**, password **`admin`** (see backend `appsettings.json`).

## Prerequisites

- Node.js (LTS)
- [Expo Go](https://expo.dev/go) on your phone (App Store / Google Play)
- API running and reachable from the device/emulator (see below)

## Install

From the repository root:

```bash
cd StudentManagementApp
npm install
```

## API base URL

The app reads **`EXPO_PUBLIC_API_BASE_URL`** (optional). If unset:

| Environment | Default base URL |
|-------------|------------------|
| Android emulator | `http://10.0.2.2:5048` (host machine’s localhost) |
| iOS simulator | `http://localhost:5048` |
| Physical device | **Set explicitly** — e.g. create `.env` with `EXPO_PUBLIC_API_BASE_URL=http://YOUR_PC_LAN_IP:5048` |

Copy `.env.example` to `.env` and set your LAN IP when using a **physical phone** on the same Wi‑Fi as your PC.

### Run the API so devices can reach it

From the solution root:

```bash
dotnet run --project src/StudentManagement.Api --launch-profile http --urls http://0.0.0.0:5048
```

`0.0.0.0` listens on all interfaces so a phone can use `http://<your-PC-LAN-IP>:5048`. Allow the port in Windows Firewall if prompted.

### Admin password / SQLite

The API seeds the admin user **once**. If you previously ran the API with a different password, delete `studentmanagement.db` next to the API project (or clear `AdminUsers`) so the new `Admin:Password` from `appsettings.json` is applied.

## Run with Expo Go

```bash
npx expo start
```

- **Physical device:** open **Expo Go**, scan the QR from the terminal or browser DevTools.
- **Android emulator:** press `a` in the Expo CLI (uses default `10.0.2.2` if you did not set `.env`).
- **iOS Simulator (macOS):** press `i`.

Optional: `npx expo start --tunnel` if LAN discovery is problematic (slower).

### If the browser shows JSON at `http://localhost:8083`

That is **normal**. The Expo dev server (Metro) serves the **app manifest** as JSON at the root URL. It is meant for **Expo Go** and native tooling, not a full web dashboard.

- **Phone:** use the **Expo Go** app and scan the **QR code printed in the terminal** where `npx expo start` is running (not the browser address bar).
- **Emulator:** in that same terminal, press **`a`** (Android) or **`i`** (iOS Simulator on Mac).
- **Web build of this app** (optional): `npx expo start --web` opens a browser UI on another port when web support is enabled.

## Features

- Login (prefilled `admin` / `admin`)
- **Students:** list (pagination, pull-to-refresh, load more), register student (subject + teacher **names** must exist)
- **Subjects / Teachers:** list + create

JWT is stored with **expo-secure-store**. Use **Logout** in the tab header to clear the session.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Expo dev server |
| `npm run android` | Open on Android |
| `npm run ios` | Open on iOS (macOS) |
