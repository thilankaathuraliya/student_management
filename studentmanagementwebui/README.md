# Student Management Web UI

React + TypeScript SPA for the Student Management API: sign in, browse paginated students/subjects/teachers, register students, and create subjects and teachers.

## Prerequisites

- Node.js (LTS recommended)
- The API running (default profile listens on **port 5048**). From the solution root:

  ```bash
  dotnet run --project src/StudentManagement.Api --launch-profile http
  ```

## Install and run

```bash
cd studentmanagementwebui
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

**Default login (development):** username `admin`, password `admin` (see `appsettings.json` in `StudentManagement.Api`).

## API URL and proxy

- **Default (recommended for local dev):** leave `VITE_API_BASE_URL` unset. The app calls relative URLs like `/api/...`, and Vite proxies `/api` to `http://localhost:5048` (see `vite.config.ts`). No CORS configuration is required on the API for this setup.
- **Direct API URL:** copy `.env.example` to `.env` and set `VITE_API_BASE_URL=http://localhost:5048` (or your deployed API). The browser will call that origin directly; you must enable CORS on the API or serve the UI from the same host as the API.

## Production build

```bash
npm run build
```

Output is in `dist/`. Serve those static files behind the same origin as the API, or configure CORS and set `VITE_API_BASE_URL` at build time.

## Token storage

The JWT is stored in `localStorage` under `studentmanagement_jwt`. For production hardening, consider httpOnly cookies or another server-managed session strategy.
