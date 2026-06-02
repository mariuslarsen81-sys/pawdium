import { neon } from "@neondatabase/serverless";

export type DiscoveryContact = {
  id: number;
  name: string;
  discipline: string;
  market: string;
  breeds: string;
  level: string;
  role: string;
  dog_kennel: string;
  why_contact: string;
  contact_route: string;
  warm_intro: string;
  status: string;
  outreach_sent_date: string | null;
  follow_up_date: string | null;
  interview_date: string | null;
  key_pain_points: string;
  current_workaround: string;
  reaction: string;
  willingness_to_pay: string;
  beta_fit: number;
  champion_potential: number;
  activity_score: number;
  credibility_score: number;
  product_fit_score: number;
  total_score: number;
  notes: string;
  next_action: string;
  source_url_1: string;
  source_url_2: string;
  created_at: string;
  updated_at: string;
};

export const STATUSES = [
  { value: "identified",             label: "Identified",        color: "#9CA3AF" },
  { value: "qualified",              label: "Qualified",         color: "#60A5FA" },
  { value: "contact-details-needed", label: "Contact Needed",    color: "#FBBF24" },
  { value: "ready-to-contact",       label: "Ready to Contact",  color: "#FB923C" },
  { value: "contacted",              label: "Contacted",         color: "#C9A24A" },
  { value: "replied",                label: "Replied",           color: "#A3E635" },
  { value: "call-booked",            label: "Call Booked",       color: "#4ADE80" },
  { value: "interviewed",            label: "Interviewed",       color: "#34D399" },
  { value: "beta-candidate",         label: "Beta Candidate",    color: "#A78BFA" },
  { value: "champion",               label: "Champion",          color: "#EDD98A" },
  { value: "not-now",                label: "Not Now",           color: "#F87171" },
];

export const DISCIPLINES = [
  { value: "show",    label: "Show" },
  { value: "agility", label: "Agility" },
  { value: "both",    label: "Both" },
  { value: "other",   label: "Other" },
];

export async function getDiscoveryDb() {
  const sql = neon(process.env.POSTGRES_URL!);
  await sql`
    CREATE TABLE IF NOT EXISTS discovery_contacts (
      id                 SERIAL PRIMARY KEY,
      name               TEXT NOT NULL,
      discipline         TEXT DEFAULT '',
      market             TEXT DEFAULT '',
      breeds             TEXT DEFAULT '',
      level              TEXT DEFAULT '',
      role               TEXT DEFAULT '',
      dog_kennel         TEXT DEFAULT '',
      why_contact        TEXT DEFAULT '',
      contact_route      TEXT DEFAULT '',
      warm_intro         TEXT DEFAULT '',
      status             TEXT DEFAULT 'identified',
      outreach_sent_date DATE,
      follow_up_date     DATE,
      interview_date     DATE,
      key_pain_points    TEXT DEFAULT '',
      current_workaround TEXT DEFAULT '',
      reaction           TEXT DEFAULT '',
      willingness_to_pay TEXT DEFAULT '',
      beta_fit           INTEGER DEFAULT 0,
      champion_potential INTEGER DEFAULT 0,
      activity_score     INTEGER DEFAULT 1,
      credibility_score  INTEGER DEFAULT 1,
      product_fit_score  INTEGER DEFAULT 1,
      notes              TEXT DEFAULT '',
      next_action        TEXT DEFAULT '',
      source_url_1       TEXT DEFAULT '',
      source_url_2       TEXT DEFAULT '',
      created_at         TIMESTAMPTZ DEFAULT NOW(),
      updated_at         TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  return sql;
}
