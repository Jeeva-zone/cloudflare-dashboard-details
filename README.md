# ⚡ CF Worker Insights

A modern, high-density real-time observability dashboard for monitoring **Cloudflare Workers**. Track daily free tier quotas, CPU execution budgets, latency distributions (P50/P90/P99), HTTP status codes, edge geographic distribution, and client invocation logs with Cloudflare Ray IDs.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- ⏱️ **Free Tier & Quota Sentinel**: Live circular progress tracking your daily 100,000 requests limit, remaining capacity, and exact UTC countdown to the 00:00 UTC quota reset.
- ⚡ **CPU Execution Time & Latency Metrics**: Real-time evaluation against the 10 ms Free Tier threshold, tracking P50, P90, and P99 tail latency percentiles.
- 📈 **Interactive Request Timeline**: Multi-series area chart tracking 2xx Success, 4xx Client Error, and 5xx/1042 Worker Exception invocations.
- 🍩 **HTTP Status Breakdown**: Interactive donut chart categorizing status codes (200, 401, 429, 500, 1042) with cross-filtering support.
- 🌍 **Geographic Edge Colos**: Top traffic regions with ISO flags, percentage share of global traffic, and edge latency benchmarks.
- 🔍 **Client Analytics Event Log**: Real-time invocation stream with masked IPs (`198.51.***.42`), Cloudflare Ray IDs, HTTP methods, device user-agents, TLS versions, and expandable request diagnostics.
- 🧪 **Live GraphQL Query Inspector & Edge Sandbox**: Built-in viewer for Cloudflare's `workersInvocationsAdaptiveGroups` GraphQL schema and triggers to simulate traffic spikes and worker error surges.
- 🌗 **Adaptive Theme**: High-contrast dark and light modes styled with Tailwind CSS.

---

## 🚀 One-Click Deploy to Cloudflare

### Method 1: Deploy with Cloudflare Pages (Recommended)

1. Click the button below or import your GitHub repository into [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages):

   [![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/)

2. Configure your build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
   - **Node.js Version**: `18` or `20` (add environment variable `NODE_VERSION=20`)

3. Click **Save and Deploy**. Your dashboard will be live at `https://<your-project>.pages.dev` in seconds!

---

### Method 2: Deploy via Wrangler CLI

You can deploy directly to Cloudflare Pages from your local terminal using Wrangler:

```bash
# 1. Install dependencies and compile static assets
npm install
npm run build

# 2. Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=cf-worker-insights
```

---

## 🔗 How to Connect to Your Real Cloudflare Worker

CF Worker Insights connects to the **Cloudflare GraphQL Analytics API** to fetch real metrics from your production Workers.

### Step 1: Create a Cloudflare API Token

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **My Profile** > **API Tokens** > click **Create Token**.
3. Select **Create Custom Token** and configure the following:
   - **Token Name**: `CF Worker Insights Analytics`
   - **Permissions**:
     - `Account` > `Account Analytics` > **Read**
     - `Account` > `Workers Scripts` > **Read**
   - **Account Resources**:
     - `Include` > `All Accounts` (or select your specific account)
4. Click **Continue to summary** and **Create Token**.
5. Copy your API token securely.

---

### Step 2: Obtain Your Account ID and Worker Script Name

1. Go to **Workers & Pages** in your Cloudflare dashboard.
2. Select your Worker from the list.
3. Your **Worker Script Name** is shown at the top (e.g. `my-production-worker`).
4. Look at the right sidebar under **Account details** to copy your **Account ID**.

---

### Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Cloudflare Credentials
VITE_CLOUDFLARE_ACCOUNT_ID="your_cloudflare_account_id"
VITE_CLOUDFLARE_API_TOKEN="your_cloudflare_api_token"
VITE_CLOUDFLARE_WORKER_NAME="my-production-worker"
```

> ⚠️ **Security Tip**: Never commit `.env.local` or your API tokens to public version control. If deploying on Cloudflare Pages, set these under **Settings > Environment variables**.

---

### Step 4: Cloudflare GraphQL API Query Reference

Cloudflare exposes worker invocations through the `workersInvocationsAdaptiveGroups` GraphQL dataset endpoint at `https://api.cloudflare.com/client/v4/graphql`.

Example request payload:

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

Curl test:

```bash
curl -X POST https://api.cloudflare.com/client/v4/graphql \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { viewer { accounts(filter: { accountTag: \"YOUR_ACCOUNT_ID\" }) { workersInvocationsAdaptiveGroups(limit: 10, filter: { scriptName: \"YOUR_WORKER_NAME\" }) { count sum { cpuTimeUs } } } } }"
  }'
```

---

## 💻 Local Development

Clone the repository and run the local development server:

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/cf-worker-insights.git
cd cf-worker-insights

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite development server at `http://localhost:3000` |
| `npm run build` | Compiles production assets into `/dist` |
| `npm run preview` | Locally previews production build |
| `npm run lint` | Runs TypeScript compiler checks (`tsc --noEmit`) |

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Charts**: [Recharts 3](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Motion](https://motion.dev/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
