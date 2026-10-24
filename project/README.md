# Root to Rise – StoreOrSell

A Smart Post-Harvest Decision Advisor that helps farmers decide whether to sell their harvest now or store it for a better future price.

## Project Structure

```
storeorsell/
├── frontend/               # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/     # UI components (Layout, Navbar, Charts, etc.)
│   │   ├── contexts/       # React contexts (Auth, History, I18n)
│   │   ├── lib/            # Calculator logic, API client, sample data
│   │   ├── pages/          # Calculator, Dashboard, History, Market, Auth
│   │   ├── types.ts        # Shared TypeScript types
│   │   └── i18n.ts         # English + Tamil translations
│   ├── .env                # VITE_API_URL (frontend only)
│   ├── .env.example
│   └── package.json
│
├── backend/                # Node.js + Express API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── calculate.js   # POST /api/calculate
│   │   │   └── history.js     # GET/POST/DELETE /api/history
│   │   ├── supabaseClient.js  # Server-side Supabase connection
│   │   └── server.js          # Express app entry point
│   ├── .env                # SUPABASE_URL, SUPABASE_ANON_KEY, PORT
│   ├── .env.example
│   └── package.json
│
├── supabase/
│   └── migrations/         # Database schema (calculation_history table)
│
├── .gitignore
└── package.json            # Root workspace scripts
```

## Architecture

The frontend talks to the backend API — it never touches Supabase directly. The backend uses the Supabase anon key to read and write the `calculation_history` table. Row-level security (RLS) policies on the table allow the anon role to insert, select, and delete rows (appropriate for this demo app without authentication).

**Why the backend uses the anon key instead of the service role key:**
The service role key bypasses RLS and should never be in client-accessible code. Since this is a demo app with no authentication and the table has RLS policies that explicitly allow anon access, the anon key is sufficient and safer. For a production app with user accounts, the backend would use the service role key combined with per-user RLS policies.

## Environment Variables

### Frontend (`frontend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | URL of the backend API | `http://localhost:3001` |

### Backend (`backend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://your-project.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anon key (RLS-protected) | `eyJ...` |
| `PORT` | Backend server port | `3001` |

Copy the `.env.example` files to `.env` in each folder and fill in real values.

## Setup & Run

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Start the backend
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3001`.

### 3. Start the frontend (in a new terminal)
```bash
cd frontend
npm run dev
```
Frontend runs on the port Vite assigns (usually `http://localhost:5173`).

### 4. Build for production
```bash
cd frontend
npm run build
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/calculate` | Calculate sell-vs-hold recommendation |
| GET | `/api/history` | Get all saved calculations |
| POST | `/api/history` | Save a calculation to the database |
| DELETE | `/api/history/:id` | Delete a single calculation |
| DELETE | `/api/history` | Clear all calculations |

## Calculation Formula

- **Sell-now value** = quantity × current price
- **Hold value** = quantity × (1 − spoilage% / 100) × expected future price − (storage cost/day × days × quantity)
- **Difference** = hold value − sell-now value
- **Recommendation** = HOLD if hold value > sell-now value, otherwise SELL NOW

## Features

- Crop selection with auto-filled sample prices (clearly labeled as sample data)
- Manual override for all auto-filled fields with lock buttons
- Linear regression price forecasting from historical sample data
- Sell-vs-hold recommendation with detailed breakdown
- Persistent calculation history (survives page refresh via Supabase)
- Dashboard with summary statistics
- Market price trends page (sample data, clearly labeled)
- English / Tamil language toggle
- Responsive design (mobile + desktop)
