# Development process

This spec was written before frontend development and given to Antigravity as the build brief — kept here for documentation of the development process.

# TrustLens Frontend Spec

## What this app does
TrustLens checks if an Instagram shop/seller is trustworthy before someone buys from them.
User enters an Instagram handle → picks a product post → enters the asking price →
gets a trust score (0-100) with a risk band and evidence per signal.

## Stack
- React + Vite
- Tailwind CSS
- No auth, no login, no user accounts — fully public, stateless tool
- No React Router needed unless you want shareable report URLs (optional: /report/:id)

## Backend API (already built and working — do not modify backend code)
Base URL: http://localhost:5000

### 1. POST /api/profile/get-profile
Request: { "handle": "instagram_handle_without_@" }
Response: {
  "profile": {
    "biography": string,
    "followers": number,
    "following": number,
    "full_name": string,
    "is_verified": boolean,
    "is_professional_account": boolean,
    "posts": [
      {
        "id": string,
        "shortcode": string,
        "display_url": string,          // use this or serpapi_display_url as image src
        "serpapi_display_url": string,
        "is_video": boolean,
        "media_captions": [string],
        "thumbnail_src": string
      }
    ]
  }
}
Errors: 400 if handle missing, 500 with { error } on failure.

### 2. POST /api/investigate/start-investigation
Request: {
  "handle": string,          // same instagram handle
  "imageUrl": string,        // the serpapi_display_url of the chosen post
  "askingPrice": number,
  "brandName": string,       // user-typed product/brand name, e.g. "nike air max muse"
  "addressQuery": string     // OPTIONAL — only if user wants to check a claimed address
}
Response: {
  "id": "uuid-string",       // save this, used to fetch report later
  "handle": string,
  "brandName": string,
  "askingPrice": number,
  "trustScore": number,      // 0-100
  "band": "Looks Reliable" | "Some Concerns" | "High Risk" | "Avoid",
  "confidence": number,      // 0-100, how many signals had data
  "signals": {
    "price": { "score": number, "median": number, "ratio": number } | null,
    "images": { "score": number, "dropshipMatchCount": number, "totalMatches": number } | null,
    "complaints": { "score": number, "hits": number } | null,
    "account": { "score": number, "scamPhraseHits": number, "followRatio": number } | null,
    "presence": { "score": number, "rating": number, "reviewCount": number, "negativeReviewHits": number } | null
  },
  "createdAt": "ISO date string"
}
Note: any signal can be null if that data wasn't available — handle this gracefully in UI
(show "Not checked" rather than breaking or showing 0).
This request takes 5-10 seconds (multiple API calls happen server-side) — show a loading state.

### 3. GET /api/reports/:id
Response: same shape as investigate response above (no "id" wrapper difference, id is included).
404 if not found: { "error": "Report not found" }

## Screens

### Screen 1: Search / Home
- Input: Instagram handle (text field, placeholder "e.g. urbanglow.store")
- Submit button: "Check this seller"
- On submit: POST /api/profile/get-profile
- Show loading state while fetching
- On error: show a clear message ("Couldn't find this account — check the handle and try again")
- On success: move to Screen 2, passing the profile data (especially posts[])
- Also show basic profile info here for context: full_name, followers, following, verified badge if is_verified

### Screen 2: Post Picker
- Grid of the seller's posts (use thumbnail_src or display_url as images)
- User clicks one post to select it
- Below/after selecting: two input fields appear:
  - "Asking price (₹)" — number input
  - "Product/brand name" — text input (e.g. "nike air max muse") — this is used to search market price, so make the placeholder/helper text explain: "What would you search to find this product online?"
- Optional field (collapsible/advanced): "Claimed address (optional)" — text input, helper text: "If the seller claims a store address, enter it to verify"
- Submit button: "Investigate" or "Run trust check"
- On submit: POST /api/investigate/start-investigation with handle + selected post's image url + the two/three fields
- Show a clear loading state — this takes 5-10 seconds, so make it feel active (e.g. a progress-style message like "Checking photos... Checking prices... Checking reviews..." even if it's not truly step-by-step, to avoid feeling frozen)

### Screen 3: Report
This is the most important screen — spend the most visual effort here.
- Large trust score (0-100) as the focal point — consider a circular gauge or big number
- Band label with color coding:
  - "Looks Reliable" (80-100) — green
  - "Some Concerns" (60-79) — yellow/amber
  - "High Risk" (40-59) — orange
  - "Avoid" (0-39) — red
- Confidence shown subtly (e.g. "Based on 4 of 5 checks" — compute from which signals are null)
- One card per signal, each showing:
  - Signal name (Price Fairness, Photo Originality, Complaints, Account Health, Store Presence)
  - That signal's own score (small bar or number)
  - 1-2 lines of plain-language explanation built from the signal's data, e.g.:
    - price: "Asking ₹2,499 vs market median ₹17,114 — this is far below typical pricing, a bait-pricing red flag"
    - images: "Found 59 matches elsewhere online, 0 on known resale/dropship sites"
    - complaints: "No scam-related mentions found"
    - account: "55/100 — moderate account health"
    - presence (if not null): "Rated 4.7 from 18,265 reviews" / if null: "No address provided to verify"
  - If a signal is null, show it as "Not checked" / grayed out, not as an error
- A disclaimer line, always visible: "This is an automated risk estimate based on public data, not a legal verdict. Always verify independently before purchasing."
- A "Check another seller" button that resets to Screen 1

## Visual style
- Clean, trustworthy, modern — this is a safety/trust tool, so avoid anything playful/cartoonish
- Color palette: neutral base (white/slate) with the 4 band colors (green/amber/orange/red) used purposefully, not everywhere
- Mobile-responsive — assume someone might check this on their phone before buying something

## Explicitly DO NOT
- Do not add login/signup/auth of any kind
- Important:- Do not modify any backend files (controllers/, services/, models/, utils/, routes/, config/, app.js)
- Do not call SerpApi directly from frontend — always go through the backend API above
- Do not hardcode a backend URL other than http://localhost:5000 for now (we'll handle env vars for deployment later if needed)
- Do not add pages/features beyond the 3 screens above unless discussed

## Visual direction (more specific)
- Mood: trustworthy and calm, like a security/safety product — think Stripe or Linear's clean 
  aesthetic, NOT a flashy startup landing page
- Typography: one clean sans-serif (Inter or similar), avoid default system font
- Base palette: mostly white/slate neutrals, NOT colorful backgrounds
- The 4 risk-band colors (green/amber/orange/red) should be the main pops of color in the 
  whole app — everything else stays muted so those colors mean something when they appear
- Avoid: gradients everywhere, excessive shadows/glow, emoji as icons, rounded-everything 
  "cute" look — this should feel serious/professional, not playful
- Use subtle icons (lucide-react is fine if available) rather than no icons at all