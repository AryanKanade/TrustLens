# TrustLens
TrustLens checks an Instagram shop's trust before you pay — stolen product photos, inflated prices, scam complaints, and seller legitimacy, all backed by live evidence links. Built for the SerpApi India Hackathon 2026 (Knowledge & Public Interest track).


# TrustLens

**A 60-second, evidence-backed trust check for Instagram sellers — built for SerpApi India Hackathon 2026.**

## What it does

TrustLens helps online shoppers in India decide whether to trust an Instagram shop before paying. 
Enter a seller's Instagram handle and the product they're selling, and TrustLens checks:

- **Price Fairness** — compares the asking price against the real market median (Google Shopping)
- **Photo Originality** — checks if product photos are stolen from known dropshipping/resale sites (Google Lens)
- **Complaints** — scans news, forums, and the web for scam-related mentions of the seller (Google News, Google Forums, Google Search)
- **Account Health** — evaluates the Instagram profile for red flags: suspicious follower ratios, scam phrases in captions, verification status (Instagram Profile API)
- **Store Presence** — verifies a claimed physical address and checks real customer reviews (Google Maps, Google Maps Reviews)

All five signals combine into a single 0–100 trust score with a risk band (Looks Reliable / Some Concerns / High Risk / Avoid), each backed by real evidence links — never a bare accusation.

**Who it's for:** everyday online shoppers in India who encounter Instagram-based sellers and have no quick way to verify legitimacy before paying.

## Track

**Knowledge & Public Interest**

## Tech stack

- **Backend:** Node.js, Express, MySQL (`mysql2`)
- **Frontend:** React (Vite), Tailwind CSS
- **Data:** SerpApi (`serpapi` npm SDK)

## Project structure

TrustLens/
├─ server/ — Express API, scoring engine, MySQL persistence
├─ frontend/ — React + Tailwind UI
└─ docs/ — project specs


## Setup instructions

### Prerequisites
- Node.js v24+ (tested on v24.12.0)
- MySQL Server running locally (or any reachable MySQL instance)
- A SerpApi account and API key: https://serpapi.com

### 1. Clone the repo
```bash
git clone https://github.com/AryanKanade/trustlens.git
cd trustlens
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env
```
Edit `server/.env` with your real SerpApi key and MySQL credentials:

PORT=5000
SERPAPI_KEY=your_actual_serpapi_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=trustlens


Create the database and tables with one command:
```bash
npm run setup-db
```

Start the backend:
```bash
npm run dev
```
Server runs on `http://localhost:5000`. You should see `Server is running on port 5000` and `MySQL connected`.

### 3. Frontend setup
In a new terminal:
```bash
cd frontend
npm install
cp .env.example .env
```
`frontend/.env` already defaults correctly for local development:
VITE_API_BASE_URL=http://localhost:5000


Start the frontend:
```bash
npm run dev
```
Open the URL shown (typically `http://localhost:5173`).

### 4. Use it
1. Enter a public Instagram handle (e.g. a real shop's handle)
2. Pick a product post from their grid
3. Enter the asking price, a product/brand search term, and optionally the claimed store address
4. Click "Run trust check" — the investigation takes 5–10 seconds (multiple SerpApi calls happen server-side)
5. View the trust score, band, and per-signal evidence

## SerpApi usage

| SerpApi Engine | Role in TrustLens |
|---|---|
| `instagram_profile` | Fetches the seller's bio, followers, following, verification status, and recent posts (used for the Account Health signal and to populate the post picker) |
| `google_lens` | Reverse-image-checks the selected product photo to detect if it's stolen from known dropshipping/resale platforms (Photo Originality signal) |
| `google_shopping` | Finds real market listings for the product to compute a fair median price (Price Fairness signal) |
| `google_news` | Searches for news coverage mentioning the brand alongside scam-related keywords (Complaints signal) |
| `google_forums` | Searches forum discussions for scam/fraud mentions of the brand (Complaints signal) |
| `google` (web search) | Fallback complaint search across the general web — review sites, blogs, social mentions the Forums engine misses (Complaints signal) |
| `google_maps` | Searches for the seller's claimed physical store location (Store Presence signal) |
| `google_maps_reviews` | Fetches real customer reviews for that location to check rating and scan for complaint language (Store Presence signal) |

All calls are made server-side via the official `serpapi` Node.js SDK, wrapped in `server/services/serpApiService.js`.

## Scoring methodology

Each signal returns a 0–100 score (or `null` if data wasn't available for that seller). The final trust score is a weighted average of all available signals — null signals are excluded and weights are renormalized, so a seller missing one data point (e.g. no claimed address) is never unfairly penalized. See `server/utils/scoring.js` for the full logic.

## Disclaimer

TrustLens provides an automated risk estimate based on public data. It is not a legal verdict. Always verify independently before purchasing from any seller.

