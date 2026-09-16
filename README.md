# ⚡ CF Worker Insights

A polished **React + TypeScript + Vite** dashboard UI for exploring Cloudflare Workers-style observability data.

> **ℹ️ Demo status:** This repository is a self-contained frontend demo. Metrics and invocation logs come from local generators in `src/data/mockData.ts`; it does **not** connect to a live Cloudflare account.

![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![TypeScript 5.8](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white) ![Vite 6](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white) ![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white) ![Recharts 3](https://img.shields.io/badge/Recharts-3-FF6384?logo=recharts&logoColor=white) ![Lucide React](https://img.shields.io/badge/Lucide_React-Icons-F56565?logo=lucide&logoColor=white) ![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222222?logo=github&logoColor=white) ![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare_Pages-F38020?logo=cloudflare&logoColor=white) ![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)

## 🌐 Live Demo

### 🚀 [Open CF Worker Insights](https://jeeva-zone.github.io/cloudflare-dashboard-details/)

The dashboard is live on **GitHub Pages** and automatically redeploys whenever changes are pushed to `main`.

[![CF Worker Insights dashboard preview](https://s.wordpress.com/mshots/v1/https%3A%2F%2Fjeeva-zone.github.io%2Fcloudflare-dashboard-details%2F?w=1400)](https://jeeva-zone.github.io/cloudflare-dashboard-details/)

> 💡 **Tip:** Click the preview above to open the live dashboard.

---

## ✨ Features

- 📊 KPI cards for request usage, CPU time, and latency
- 📈 Interactive invocation and latency charts
- 🍩 HTTP status-code visualization with cross-filtering
- 🌍 Geographic traffic distribution
- 🔍 Client invocation logs with expandable diagnostics
- 🧪 Example Cloudflare Analytics GraphQL query inspector
- 🚦 Synthetic traffic-burst and worker-exception simulations
- 🌗 Dark/light theme
- 🔄 Configurable auto-refresh simulation
- 📱 Responsive dashboard layout

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI components and state |
| TypeScript 5.8 | Type safety |
| Vite 6 | Development server and production bundling |
| Tailwind CSS 4 | Styling |
| Recharts 3 | Data visualization |
| Lucide React | Icons |

Only dependencies required by the current frontend are kept in `package.json`.

---

## 🌐 Deploy to GitHub Pages

The repository is configured for automatic GitHub Pages deployment with **GitHub Actions**.

### Live URL

The live dashboard is available at:

**https://jeeva-zone.github.io/cloudflare-dashboard-details/**

### One-time GitHub setup

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Push to `main` or run **Deploy to GitHub Pages** manually from the **Actions** tab.

Every push to `main` automatically:

1. Installs the npm dependencies.
2. Runs `npm run build`.
3. Uploads the generated `dist/` directory.
4. Publishes it through GitHub Pages.

The Vite configuration automatically uses `/cloudflare-dashboard-details/` when the build runs in GitHub Actions, so asset URLs work correctly on the repository subpath. Local development and Cloudflare Pages continue to use `/`.

---

## 🚀 Deploy to Cloudflare Pages

This is a **Vite frontend**, so deploy the generated `dist/` directory to **Cloudflare Pages**.

### GitHub → Cloudflare Pages

1. Open https://dash.cloudflare.com/
2. Go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select `Jeeva-zone/cloudflare-dashboard-details`.
4. Use these settings:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | `Vite` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

5. Deploy.

### Wrangler

```bash
npm install
npm run build
npx wrangler pages deploy dist --project-name=cf-worker-insights
```

> **Important:** Do not use `deploy.workers.cloudflare.com` Worker deployment buttons for this repository. This project builds a static Vite site for **Cloudflare Pages**.

---

## 💻 Local Development

Requirements: **Node.js 18+** and npm.

```bash
git clone https://github.com/Jeeva-zone/cloudflare-dashboard-details.git
cd cloudflare-dashboard-details
npm install
npm run dev
```

Open `http://localhost:3000`.

### Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite on port 3000 |
| `npm run build` | Build production files into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run TypeScript checks |

---

## ☁️ Cloudflare Integration

The current application does **not** make authenticated Cloudflare API requests. The GraphQL inspector displays an example query for reference only.

If live analytics are added later, use a server-side API or Cloudflare Worker as the credential boundary:

```text
React browser UI
      │
      ▼
Your server-side endpoint / Worker
      │
      │ secret API token
      ▼
Cloudflare GraphQL Analytics API
```

Never expose a Cloudflare API token in browser-bundled `VITE_*` variables.

Official documentation:
https://developers.cloudflare.com/analytics/graphql-api/

## 🔐 Security

- Never commit API tokens or other secrets.
- Keep Cloudflare credentials server-side or in Worker secrets.
- Do not place credentials in `VITE_*` variables.
- Rotate/revoke credentials if they are accidentally exposed.

---

## 📁 Project Structure

```text
cloudflare-dashboard-details/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── src/
│   ├── components/
│   │   ├── ClientAnalyticsTable.tsx
│   │   ├── GeoDistribution.tsx
│   │   ├── GraphQLModal.tsx
│   │   ├── Header.tsx
│   │   ├── InvocationsAreaChart.tsx
│   │   ├── KpiSummaryCards.tsx
│   │   ├── LatencyLineChart.tsx
│   │   └── StatusCodeDonutChart.tsx
│   ├── data/
│   │   └── mockData.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```

## 🔗 Useful Links

- **Live Demo:** https://jeeva-zone.github.io/cloudflare-dashboard-details/
- **Repository:** https://github.com/Jeeva-zone/cloudflare-dashboard-details
- **GitHub Pages:** https://pages.github.com/
- **Cloudflare Pages:** https://developers.cloudflare.com/pages/
- **Cloudflare Pages Git integration:** https://developers.cloudflare.com/pages/get-started/git-integration/
- **Cloudflare Pages Direct Upload:** https://developers.cloudflare.com/pages/get-started/direct-upload/
- **Cloudflare Workers:** https://developers.cloudflare.com/workers/
- **Cloudflare GraphQL API:** https://developers.cloudflare.com/analytics/graphql-api/

## 📄 License

This project is released under the MIT License.
