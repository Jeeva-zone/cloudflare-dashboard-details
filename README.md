# ⚡ CF Worker Insights

A modern, high-density observability dashboard UI for exploring **Cloudflare Workers-style metrics**. The current repository is a **React + Vite demo application** with realistic mock data, interactive charts, filters, live-looking invocation logs, and a GraphQL query inspector UI.

> ⚠️ **Important:** This repository currently uses local mock data. It does **not** connect to the Cloudflare Analytics GraphQL API by itself. Do not put a real Cloudflare API token in a `VITE_*` variable because Vite exposes `VITE_*` values to browser-side code.

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript 5.8](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite 6](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- ⏱️ **Quota Sentinel UI** — visualizes daily request usage, remaining capacity, and a UTC reset countdown using demo data.
- ⚡ **CPU & Latency Metrics** — displays CPU execution and P50/P90/P99 latency metrics using generated demo data.
- 📈 **Interactive Request Timeline** — charts 2xx, 4xx, and 5xx/1042-style invocation data.
- 🍩 **HTTP Status Breakdown** — interactive status-code donut chart with filtering.
- 🌍 **Geographic Edge Colos** — displays demo traffic distribution and edge latency information.
- 🔍 **Client Analytics Event Log** — realistic-looking invocation records with masked IPs, Ray IDs, HTTP methods, user agents, and TLS information.
- 🧪 **GraphQL Query Inspector UI** — shows an example Cloudflare Workers Analytics GraphQL query.
- 🧰 **Edge Sandbox UI** — lets you simulate traffic/error events inside the demo interface.
- 🌗 **Adaptive Theme** — high-contrast dark/light modes.

---

## 🚀 Deploy to Cloudflare Pages

### Important: the Cloudflare one-click Worker button is intentionally not used

You may see `Deploy to Cloudflare` buttons in other repositories that use this URL:

```text
https://deploy.workers.cloudflare.com/?url=...
```

That button is for **Cloudflare Workers applications**. Cloudflare's documentation explicitly states that Deploy to Cloudflare buttons do **not** support Pages applications. This repository is a Vite static site and is therefore documented for **Cloudflare Pages** deployment instead.

### Method 1 — Cloudflare Pages + GitHub (recommended)

1. Open **Cloudflare Dashboard → Workers & Pages**:
   https://dash.cloudflare.com/
2. Select **Create application** → **Pages** → **Connect to Git**.
3. Connect GitHub and select:
   `Jeeva-zone/cloudflare-dashboard-details`
4. Use these build settings:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | `Vite` (if offered) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

5. Click **Save and Deploy**.

Cloudflare Pages will build the Vite application and publish the generated `dist` directory. After the first deployment, pushes to the connected production branch can trigger automatic deployments.

📚 Official Cloudflare Pages Git integration guide:
https://developers.cloudflare.com/pages/get-started/git-integration/

---

### Method 2 — Wrangler CLI / Direct Upload

For a local build followed by a direct Pages deployment:

```bash
# Install dependencies
npm install

# Build the production site
npm run build

# Deploy the dist directory to Cloudflare Pages
npx wrangler pages deploy dist --project-name=cf-worker-insights
```

If the Pages project does not already exist, Wrangler will guide you through the required project setup.

📚 Official Cloudflare Pages Direct Upload documentation:
https://developers.cloudflare.com/pages/get-started/direct-upload/

> **Note:** A Pages project created with Direct Upload cannot later be switched to Git integration. If you want automatic GitHub deployments, use **Method 1** when creating the project.

---

## 🧪 Local Development

Clone this repository and start the Vite development server:

```bash
git clone https://github.com/Jeeva-zone/cloudflare-dashboard-details.git
cd cloudflare-dashboard-details
npm install
npm run dev
```

The development server is configured to use:

```text
http://localhost:3000
```

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite on port 3000 |
| `npm run build` | Creates the production build in `/dist` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs TypeScript checks with `tsc --noEmit` |

---

## ☁️ Using Real Cloudflare Analytics

The current UI is intentionally self-contained and uses data from `src/data/mockData.ts`. It does not currently make authenticated requests to Cloudflare's Analytics GraphQL API.

If you extend the application to use real Cloudflare data, **do not expose a Cloudflare API token in browser code**. In particular, avoid putting secrets in variables such as:

```env
VITE_CLOUDFLARE_API_TOKEN=...
```

`VITE_*` variables are intended for values that can safely be shipped to the browser.

### Recommended architecture

```text
Browser / React UI
        │
        │ HTTPS
        ▼
Cloudflare Worker / Server-side API
        │
        │ Secret API token
        ▼
Cloudflare GraphQL Analytics API
```

Keep the Cloudflare API token in a server-side secret or Worker secret and have the browser call your own authenticated backend endpoint.

Cloudflare GraphQL Analytics endpoint:

```text
https://api.cloudflare.com/client/v4/graphql
```

Official documentation:
https://developers.cloudflare.com/analytics/graphql-api/

---

## 🔎 Example GraphQL Query

The dashboard includes a GraphQL inspector showing the following **example** query shape:

```graphql
query GetWorkerMetrics($accountTag: String!, $scriptName: String!, $since: String!, $until: String!) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      workersInvocationsAdaptiveGroups(
        limit: 1000
        filter: {
          scriptName: $scriptName
          datetime_geq: $since
          datetime_leq: $until
        }
      ) {
        count
        sum {
          subrequests
          cpuTimeUs
        }
        quantiles {
          cpuTimeUsP50
          cpuTimeUsP90
          cpuTimeUsP99
          durationMsP50
          durationMsP90
          durationMsP99
        }
        dimensions {
          status
          datetimeHour
        }
      }
    }
  }
}
```

Treat this as an example for integrating the UI with a backend. Cloudflare's GraphQL schema and available datasets can change, so verify the current schema against the official documentation before implementing production analytics.

---

## 🔐 Cloudflare API Token Security

If you later add a backend integration:

1. Create a Cloudflare API token with only the permissions your backend actually needs.
2. Store the token as a server-side secret.
3. Never commit the token to GitHub.
4. Never place the token in browser-bundled `VITE_*` variables.
5. Rotate/revoke tokens if they are accidentally exposed.

For Cloudflare Workers, use Worker secrets rather than hard-coding credentials in source code.

Official Cloudflare API token documentation:
https://developers.cloudflare.com/fundamentals/api/get-started/create-token/

---

## 🛠️ Tech Stack

- **UI:** React 19
- **Language:** TypeScript 5.8
- **Bundler:** Vite 6
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts 3
- **Icons:** Lucide React
- **Animation:** Motion
- **Deployment target:** Cloudflare Pages

---

## 📁 Project Structure

```text
cloudflare-dashboard-details/
├── src/
│   ├── components/       # Dashboard UI components
│   ├── data/             # Mock/demo analytics data
│   ├── App.tsx           # Main dashboard application
│   ├── index.css         # Global styles
│   ├── main.tsx          # React entry point
│   └── types.ts          # TypeScript types
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── bun.lock
├── .env.example
└── README.md
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🔗 Useful Links

- **Repository:** https://github.com/Jeeva-zone/cloudflare-dashboard-details
- **Cloudflare Pages:** https://developers.cloudflare.com/pages/
- **Cloudflare Pages Git integration:** https://developers.cloudflare.com/pages/get-started/git-integration/
- **Cloudflare Pages Direct Upload:** https://developers.cloudflare.com/pages/get-started/direct-upload/
- **Cloudflare Workers:** https://developers.cloudflare.com/workers/
- **Cloudflare GraphQL API:** https://developers.cloudflare.com/analytics/graphql-api/
