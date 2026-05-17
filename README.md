# LeadLoom

**ToS-safe Facebook lead CRM and AI outreach assistant.** Chrome Extension (Manifest V3) built with React + TypeScript + Tailwind, backed by IndexedDB and the official Meta Graph API.

---

## What it does

LeadLoom turns Facebook leads into a managed pipeline:

- **Captures leads** from three legitimate sources:
  1. **Meta Lead Ads** — pulls form submissions via the official Graph API on a schedule.
  2. **Page mentions** — public posts that tagged your Page (via Graph API).
  3. **Manual save** — when you're viewing a public post on Facebook, click the floating *Save lead* button to file it. The extension reads the address bar and any text you selected — it never crawls or auto-scrolls.
- **Scores each lead** with a local heuristic (free, instant) and optionally upgrades it with Claude or OpenAI to classify hot / warm / cold and detect intent.
- **Drafts personalized outreach** in your voice (friendly, professional, casual, direct) — but never sends. You always click send inside Messenger.
- **Tracks the pipeline** through stages — new → contacted → replied → interested → closed — with notes, tags, follow-up reminders, and full history.
- **Exports anywhere** — CSV, Excel, JSON, with one click.

---

## What it deliberately does NOT do

Facebook's Terms of Service and Platform Policies prohibit automated scraping and bulk unsolicited messaging. LeadLoom is engineered to stay on the right side of that line:

| ❌ Not in LeadLoom | ✅ Instead, LeadLoom… |
|---|---|
| Scraping search results, groups, public profiles | Reads only what arrives via Meta's official APIs or what *you* manually capture |
| Auto-scrolling, pagination spiders, headless browsing | Has no crawler — every saved lead is one user click |
| Automated mass messaging via Messenger | Drafts messages and copies them to your clipboard / opens Messenger; you click send |
| "Anti-detection" delays, fingerprint spoofing, rate-limit evasion | Uses official, supported endpoints with documented rate limits |
| Sending without consent | Outreach assumes the lead opted in (Lead Ads) or publicly tagged you (Page mention) |

If you need volume outreach to cold prospects, this isn't the tool for that, and we recommend you don't build one — it's a fast track to bans, complaints, and (in the US/EU) legal exposure under CAN-SPAM, GDPR, and CFAA.

---

## Quick start

1. **Install dependencies** — `npm install`
2. **Build** — `npm run build` (outputs to `dist/`)
3. **Load into Chrome**:
   - Open `chrome://extensions`
   - Toggle "Developer mode" on (top right)
   - Click "Load unpacked"
   - Select the `dist/` folder
4. **Open the dashboard** — click the LeadLoom toolbar icon, then "View all"
5. **Add API keys** — Settings → paste your Anthropic key (recommended) and your Meta access token

See [`docs/INSTALLATION.md`](docs/INSTALLATION.md) for the full walkthrough and [`docs/API_INTEGRATION.md`](docs/API_INTEGRATION.md) for Meta token setup.

---

## Architecture at a glance

```
┌─────────────────────────────────────────────────────────────────┐
│                  Chrome Extension (Manifest V3)                  │
├──────────────┬──────────────────┬────────────────┬──────────────┤
│  Popup UI    │  Dashboard SPA   │ Content Script │ Service      │
│  (React)     │  (React + Router)│ (vanilla TS)   │ Worker       │
│              │                  │                │              │
│  - Stats     │  - Leads table   │ - "Save lead"  │ - Routes     │
│  - Recent    │  - Drawer + AI   │   button on    │   messages   │
│    leads     │    composer      │   FB post URLs │ - chrome.    │
│  - Open      │  - Keywords,     │ - User-driven  │   alarms     │
│    dashboard │    Templates,    │   only         │   syncs      │
│              │    Analytics,    │                │ - AI calls   │
│              │    Settings      │                │ - Notifs     │
└──────┬───────┴──────────┬───────┴────────┬───────┴──────┬───────┘
       │                  │                │              │
       └──────────────────┴────┬───────────┴──────────────┘
                               │
                    chrome.runtime.sendMessage
                               │
                ┌──────────────┴───────────────┐
                │   IndexedDB (via Dexie)      │
                │   - leads, keywords,         │
                │     templates, outreach,     │
                │     settings                 │
                └──────────────┬───────────────┘
                               │
                ┌──────────────┴───────────────┐
                │   External APIs              │
                │   - api.anthropic.com        │
                │   - api.openai.com (fallback)│
                │   - graph.facebook.com       │
                └──────────────────────────────┘
```

More detail: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Folder structure

```
.
├── manifest.json                    # MV3 manifest
├── package.json
├── vite.config.ts                   # Build via @crxjs/vite-plugin
├── tsconfig.json
├── tailwind.config.js
├── public/icons/                    # Toolbar icons
├── src/
│   ├── background/
│   │   └── service-worker.ts        # MV3 worker: router, syncs, AI
│   ├── content/
│   │   ├── facebook-content.ts      # "Save lead" injector (user-click only)
│   │   └── facebook-content.css
│   ├── popup/
│   │   ├── index.html
│   │   ├── main.tsx
│   │   └── Popup.tsx
│   ├── dashboard/
│   │   ├── index.html
│   │   ├── styles.css               # Tailwind entry + CSS variables
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── hooks/
│   │   │   ├── useTheme.ts
│   │   │   └── useRuntime.ts        # typed chrome.runtime.sendMessage
│   │   ├── pages/
│   │   │   ├── Leads.tsx
│   │   │   ├── Keywords.tsx
│   │   │   ├── Templates.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── Settings.tsx
│   │   └── components/
│   │       ├── Sidebar.tsx
│   │       ├── LeadFilters.tsx
│   │       ├── LeadTable.tsx
│   │       ├── LeadDrawer.tsx
│   │       ├── MessageComposer.tsx
│   │       └── ExportMenu.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts            # Dexie schema (versioned)
│   │   │   └── index.ts             # High-level CRUD
│   │   ├── api/
│   │   │   ├── meta.ts              # Graph API: pages, lead ads, mentions
│   │   │   └── ai.ts                # Claude + OpenAI clients
│   │   ├── scoring/
│   │   │   └── index.ts             # Heuristic + AI lead scoring
│   │   ├── export/
│   │   │   └── index.ts             # CSV / XLSX / JSON
│   │   ├── notifications/
│   │   │   └── index.ts             # chrome.notifications wrapper
│   │   ├── templates/
│   │   │   ├── seed.ts              # Default message templates
│   │   │   └── keywords-seed.ts     # Default keywords
│   │   └── utils.ts                 # cn, uid, now, timeAgo, …
│   └── types/
│       └── index.ts                 # All persisted entity types
└── docs/
    ├── ARCHITECTURE.md
    ├── INSTALLATION.md
    ├── API_INTEGRATION.md
    ├── DEPLOYMENT.md
    └── SECURITY.md
```

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 18 + Tailwind 3 + Lucide icons | Component reuse, Notion/Linear-style polish |
| Routing | react-router (HashRouter) | Works inside `chrome-extension://` URLs |
| Storage | IndexedDB via Dexie + dexie-react-hooks | Reactive `useLiveQuery`, runs in MV3 worker |
| Build | Vite + @crxjs/vite-plugin | MV3-aware HMR, dual entry points (popup, dashboard) |
| AI | Anthropic Messages API (primary), OpenAI Chat Completions (fallback) | Both reachable directly from the worker; no proxy required |
| Meta | Graph API v21 — Lead Ads, Page mentions | Official, supported, sustainable |

---

## Roadmap

- Bulk CSV import with field-mapping wizard
- Webhook receiver mode (alternative to polling Lead Ads)
- Per-lead follow-up reminders surfaced as desktop notifications
- Optional encrypted cloud sync (Firebase / Supabase) — opt-in, end-to-end
- Browser-side analytics dashboard (cohort retention, response rate)

---

## License

MIT — see `LICENSE`.
