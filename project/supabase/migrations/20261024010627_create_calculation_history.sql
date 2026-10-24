/*
# Create calculation_history table (demo, single-tenant)

## Purpose
Stores crop sell-vs-hold calculations so they persist across page reloads.
This is a demo/single-tenant app — there is no real authentication, so all
calculations are shared and accessible to anyone with the anon key.

## New Tables
- `calculation_history`
  - `id` (uuid, primary key, auto-generated)
  - `created_at` (timestamptz, when the calculation was saved)
  - `crop` (text, not null) — crop name selected by the farmer
  - `quantity` (numeric, not null) — quantity in kg
  - `storage_days` (integer, not null) — planned storage period in days
  - `current_price` (numeric, not null) — market price at time of calculation (₹/kg)
  - `expected_price` (numeric, not null) — forecasted future price (₹/kg)
  - `storage_cost_per_day` (numeric, not null) — storage cost (₹/kg/day)
  - `moisture` (numeric, not null) — moisture content (%)
  - `spoilage_percent` (numeric, not null) — expected spoilage (%)
  - `sell_now_value` (numeric, not null) — revenue if sold immediately
  - `hold_value` (numeric, not null) — net revenue after storage
  - `storage_cost_total` (numeric, not null) — total storage cost
  - `spoilage_loss` (numeric, not null) — value lost to spoilage
  - `net_difference` (numeric, not null) — hold value minus sell-now value
  - `recommendation` (text, not null) — 'hold' or 'sell'
  - `data_source` (text, not null, default 'sample') — source of price data

## Security
- RLS enabled on `calculation_history`.
- Grants: SELECT, INSERT, DELETE to `anon` and `authenticated`.
- Policies: open read/write for `anon, authenticated` because this is a
  single-tenant demo app with no authentication — all data is intentionally
  shared. This is clearly labeled as demo-only in the UI.
- No UPDATE grant: calculations are immutable once saved (no editing).
*/

CREATE TABLE IF NOT EXISTS calculation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  crop text NOT NULL,
  quantity numeric NOT NULL,
  storage_days integer NOT NULL,
  current_price numeric NOT NULL,
  expected_price numeric NOT NULL,
  storage_cost_per_day numeric NOT NULL,
  moisture numeric NOT NULL,
  spoilage_percent numeric NOT NULL,
  sell_now_value numeric NOT NULL,
  hold_value numeric NOT NULL,
  storage_cost_total numeric NOT NULL,
  spoilage_loss numeric NOT NULL,
  net_difference numeric NOT NULL,
  recommendation text NOT NULL CHECK (recommendation IN ('hold', 'sell')),
  data_source text NOT NULL DEFAULT 'sample'
);

ALTER TABLE calculation_history ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON calculation_history TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_history" ON calculation_history;
CREATE POLICY "anon_select_history" ON calculation_history
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_history" ON calculation_history;
CREATE POLICY "anon_insert_history" ON calculation_history
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_history" ON calculation_history;
CREATE POLICY "anon_delete_history" ON calculation_history
  FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_calculation_history_created_at
  ON calculation_history (created_at DESC);
