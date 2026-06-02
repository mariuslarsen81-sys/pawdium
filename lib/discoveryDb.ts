import { neon } from "@neondatabase/serverless";

// ─── Types ───────────────────────────────────────────────────────────────────

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
  call_outcome: string;
  key_pain_points: string;
  current_workaround: string;
  reaction: string;
  willingness_to_pay: string;
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

export type InterviewNote = {
  id: number;
  contact_id: number | null;
  contact_name: string;
  date: string | null;
  discipline: string;
  current_workaround: string;
  biggest_pain: string;
  what_tracks_today: string;
  what_shares_today: string;
  reaction_pawdium: string;
  reaction_result_cards: string;
  reaction_achievement_rack: string;
  reaction_show_diary: string;
  verification_concerns: string;
  would_pay: string;
  price_reaction: string;
  must_have_features: string;
  objections: string;
  quote: string;
  follow_up_action: string;
  created_at: string;
  updated_at: string;
};

export type OutreachTemplate = {
  id: number;
  type: string;
  label: string;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

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

export const REACTIONS = [
  { value: "",              label: "—" },
  { value: "very-positive", label: "Very positive", color: "#4ADE80" },
  { value: "positive",      label: "Positive",       color: "#A3E635" },
  { value: "neutral",       label: "Neutral",         color: "#9CA3AF" },
  { value: "sceptical",     label: "Sceptical",       color: "#FBBF24" },
  { value: "negative",      label: "Negative",        color: "#F87171" },
];

export const TEMPLATE_TYPES = [
  { value: "show-exhibitor",         label: "Show Exhibitor" },
  { value: "agility-handler",        label: "Agility Handler" },
  { value: "breeder-owner-handler",  label: "Breeder-Owner-Handler" },
  { value: "photographer",           label: "Photographer" },
  { value: "organiser",              label: "Organiser / Club" },
  { value: "follow-up",              label: "Follow-up" },
];

// ─── Score helpers ────────────────────────────────────────────────────────────

export function scoreColor(n: number): string {
  if (n >= 17) return "#C9A24A"; // must speak to
  if (n >= 13) return "#60A5FA"; // strong
  if (n >= 9)  return "#9CA3AF"; // useful
  return "#6B7280";              // park
}

export function scoreLabel(n: number): string {
  if (n >= 17) return "Must speak to";
  if (n >= 13) return "Strong";
  if (n >= 9)  return "Useful";
  return "Park";
}

// ─── DB init ──────────────────────────────────────────────────────────────────

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
      call_outcome       TEXT DEFAULT '',
      key_pain_points    TEXT DEFAULT '',
      current_workaround TEXT DEFAULT '',
      reaction           TEXT DEFAULT '',
      willingness_to_pay TEXT DEFAULT '',
      champion_potential INTEGER DEFAULT 1,
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

  // Add call_outcome if missing from older installs
  await sql`ALTER TABLE discovery_contacts ADD COLUMN IF NOT EXISTS call_outcome TEXT DEFAULT ''`;

  await sql`
    CREATE TABLE IF NOT EXISTS interview_notes (
      id                       SERIAL PRIMARY KEY,
      contact_id               INTEGER REFERENCES discovery_contacts(id) ON DELETE SET NULL,
      contact_name             TEXT DEFAULT '',
      date                     DATE,
      discipline               TEXT DEFAULT '',
      current_workaround       TEXT DEFAULT '',
      biggest_pain             TEXT DEFAULT '',
      what_tracks_today        TEXT DEFAULT '',
      what_shares_today        TEXT DEFAULT '',
      reaction_pawdium         TEXT DEFAULT '',
      reaction_result_cards    TEXT DEFAULT '',
      reaction_achievement_rack TEXT DEFAULT '',
      reaction_show_diary      TEXT DEFAULT '',
      verification_concerns    TEXT DEFAULT '',
      would_pay                TEXT DEFAULT '',
      price_reaction           TEXT DEFAULT '',
      must_have_features       TEXT DEFAULT '',
      objections               TEXT DEFAULT '',
      quote                    TEXT DEFAULT '',
      follow_up_action         TEXT DEFAULT '',
      created_at               TIMESTAMPTZ DEFAULT NOW(),
      updated_at               TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS outreach_templates (
      id         SERIAL PRIMARY KEY,
      type       TEXT NOT NULL DEFAULT '',
      label      TEXT DEFAULT '',
      subject    TEXT DEFAULT '',
      body       TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  return sql;
}
