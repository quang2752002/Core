# Core Workspace frontend

Next.js App Router + TypeScript + Axios, connected to the ASP.NET Core API in `../API`. The Vietnamese interface includes sign-in, session restoration, logout, paginated categories, create/edit forms, delete confirmation, and permission-based actions.

## Run locally

Start the backend from the repository root in one terminal:

```powershell
dotnet run --project API\API\API.csproj --launch-profile http
```

Start the frontend in another terminal:

```powershell
cd my-app
npm install
npm run dev
```

Open [Core Workspace](http://localhost:3000). `/` opens `/categories`; users without a session are directed to `/login`.

The default backend address is `http://localhost:5082/api`. To change it, copy `.env.example` to `.env.local`, set `API_BASE_URL`, and restart Next.js. This server environment variable must point to an address reachable from the Next.js server. Use the HTTP launch profile locally, or configure a trusted HTTPS certificate; certificate validation is kept enabled.

Sample backend accounts:

- `admin` / `ChangeMe123!`: read, create, edit, and delete categories.
- `user` / `ChangeMe123!`: read categories only.

These are the backend development accounts. Categories are persisted by the backend in SQLite. The frontend does not seed or mock data. The illustration on the sign-in page is decorative.

## Structure and integration

- `lib/http.ts`: shared browser Axios instance, timeout, error formatting, and expired-session interceptor.
- `features/auth`: typed auth service, context provider, and sign-in UI.
- `features/categories`: typed Axios service, paginated workspace, create/edit dialog, and delete confirmation.
- `components/layout`: workspace navigation and account controls.
- `app/api/[...path]/route.ts`: restricted Next.js proxy for auth/category endpoints; server-side Axios forwards requests to .NET.

The browser calls same-origin Next.js routes using Axios. Login stores the backend JWT in an HttpOnly, SameSite=Lax cookie; only account details are returned to browser JavaScript. The proxy attaches the bearer token when calling .NET. This arrangement does not require backend CORS configuration.

Cookies expire with the JWT. A backend 401 clears the cookie and requests sign-in; there is no refresh-token endpoint in the current backend. Logout clears the browser cookie. The backend validates JWTs and enforces permissions; hiding buttons is an interface convenience. Mutations reject a different browser Origin, and session responses use `no-store`.

The list uses the backend page/pageSize parameters with 10 records per page. Since the API does not return a total, Next is enabled when the current page is full; the last next page can be empty. No global count is fabricated.

## Build

```powershell
npm run build
npm start
```

Production requires a running Next.js server and a reachable backend configured through `API_BASE_URL`. Use HTTPS in production for Secure session cookies. The interface uses native CSS and system fonts so builds do not download fonts.
