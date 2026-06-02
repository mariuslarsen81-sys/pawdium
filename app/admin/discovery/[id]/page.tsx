"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DiscoveryContact, STATUSES, scoreColor, scoreLabel } from "@/lib/discoveryDb";

// ─── helpers ────────────────────────────────────────────────────────────────

function dateVal(v: string | null | undefined) {
  if (!v) return "";
  return String(v).substring(0, 10);
}

const MARKETS  = ["UK", "US", "Europe", "Australia", "Canada", "Ireland", "Other"];
const REACTIONS = ["", "Love", "Interested", "Sceptical", "No"];
const PAYS     = ["", "None", "Maybe", "Yes — unclear amount", "Yes — £5/mo", "Yes — £10/mo", "Yes — £15+/mo"];
const CALL_OUTCOMES = ["", "Completed — positive", "Completed — neutral", "Completed — not a fit", "No show", "Rescheduled", "Declined"];

const BLANK: Partial<DiscoveryContact> = {
  name: "", discipline: "", market: "", breeds: "", level: "", role: "",
  dog_kennel: "", why_contact: "", contact_route: "", warm_intro: "",
  email: "", phone: "",
  status: "identified", outreach_sent_date: null, follow_up_date: null,
  interview_date: null, call_outcome: "",
  key_pain_points: "", current_workaround: "", reaction: "", willingness_to_pay: "",
  champion_potential: 1, activity_score: 1, credibility_score: 1, product_fit_score: 1,
  notes: "", next_action: "", source_url_1: "", source_url_2: "",
};

// ─── sub-components ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-plum-800 border border-plum-700 rounded-xl p-5 mb-4">
      <h3 className="text-xs font-semibold text-stone/60 uppercase tracking-widest mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-xs text-stone/70 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inp = "w-full px-3 py-2.5 rounded-lg bg-plum-700 border border-plum-500 text-ivory text-sm placeholder-stone/45 focus:outline-none focus:border-gold-500";
const sel = `${inp} cursor-pointer`;
const tex = `${inp} resize-none`;

function ScoreRow({ label, value, onChange, hint }: {
  label: string; value: number; onChange: (v: number) => void; hint: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs text-stone/45">{label}</span>
        <span className="text-xs text-stone/50">{hint}</span>
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n} type="button" onClick={() => onChange(n)}
            className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
            style={n === value
              ? { background: "linear-gradient(135deg,#EDD98A,#C9A24A)", color: "#111014" }
              : { background: "rgba(17,16,20,0.5)", border: "1px solid rgba(201,162,74,0.18)", color: "#9CA3AF" }
            }
          >{n}</button>
        ))}
      </div>
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function ContactPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew  = params.id === "new";

  const [contact, setContact] = useState<Partial<DiscoveryContact>>(BLANK);
  const [loading,  setLoading]  = useState(!isNew);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savedOk,  setSavedOk]  = useState(false);
  const [err,      setErr]      = useState("");

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/discovery/${params.id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setContact(d); setLoading(false); })
      .catch(() => { setErr("Failed to load contact."); setLoading(false); });
  }, [params.id, isNew]);

  const set = useCallback((field: keyof DiscoveryContact, value: unknown) => {
    setContact(prev => ({ ...prev, [field]: value }));
  }, []);

  async function save() {
    if (!contact.name?.trim()) { setErr("Name is required."); return; }
    setSaving(true); setErr("");
    try {
      const url    = isNew ? "/api/admin/discovery" : `/api/admin/discovery/${params.id}`;
      const method = isNew ? "POST" : "PATCH";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(contact) });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      if (isNew) { router.push(`/admin/discovery/${saved.id}`); }
      else { setContact(saved); setSavedOk(true); setTimeout(() => setSavedOk(false), 2500); }
    } catch { setErr("Save failed."); }
    setSaving(false);
  }

  async function del() {
    if (!confirm(`Delete ${contact.name}? This cannot be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/admin/discovery/${params.id}`, { method: "DELETE" });
    router.push("/admin/discovery");
  }

  const totalScore = (contact.activity_score ?? 1) + (contact.credibility_score ?? 1)
                   + (contact.product_fit_score ?? 1) + (contact.champion_potential ?? 1);
  const sc = scoreColor(totalScore);
  const sl = scoreLabel(totalScore);

  if (loading) return <div className="text-center py-20 text-stone/35 text-sm">Loading…</div>;

  return (
    <div className="px-5 py-8 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/admin/discovery" className="text-stone/35 hover:text-stone/60 transition-colors text-sm flex-shrink-0">← Contacts</Link>
          {!isNew && contact.name && (
            <><span className="text-stone/20 text-sm">/</span><span className="text-ivory text-sm font-medium truncate">{contact.name}</span></>
          )}
          {isNew && <span className="text-stone/40 text-sm">/ New contact</span>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          {!isNew && (
            <button onClick={del} disabled={deleting} className="text-xs text-red-400/50 hover:text-red-400 transition-colors px-2 py-1">
              {deleting ? "…" : "Delete"}
            </button>
          )}
          <button onClick={save} disabled={saving}
            className="text-sm font-semibold px-4 py-2 rounded-lg text-plum-900 disabled:opacity-60 min-w-[80px]"
            style={{ background: "linear-gradient(135deg,#EDD98A,#C9A24A)" }}>
            {saving ? "Saving…" : savedOk ? "Saved ✓" : isNew ? "Create" : "Save"}
          </button>
        </div>
      </div>

      {err && <p className="text-red-400 text-sm mb-4">{err}</p>}

      {/* ── Identity ── */}
      <Section title="Identity">
        <Field label="Name *">
          <input className={inp} value={contact.name ?? ""} onChange={e => set("name", e.target.value)} placeholder="Full name or name / kennel" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Discipline">
            <select className={sel} value={contact.discipline ?? ""} onChange={e => set("discipline", e.target.value)}>
              <option value="">—</option>
              <option value="show">Show</option>
              <option value="agility">Agility</option>
              <option value="both">Both</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Market">
            <select className={sel} value={contact.market ?? ""} onChange={e => set("market", e.target.value)}>
              <option value="">—</option>
              {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Level">
            <select className={sel} value={contact.level ?? ""} onChange={e => set("level", e.target.value)}>
              <option value="">—</option>
              <option value="elite">Elite</option>
              <option value="serious">Serious hobbyist</option>
              <option value="beginner">Beginner</option>
              <option value="organiser">Organiser / official</option>
            </select>
          </Field>
          <Field label="Role">
            <select className={sel} value={contact.role ?? ""} onChange={e => set("role", e.target.value)}>
              <option value="">—</option>
              <option value="exhibitor">Show Exhibitor</option>
              <option value="agility-handler">Agility Handler</option>
              <option value="breeder-owner-handler">Breeder-Owner-Handler</option>
              <option value="professional-handler">Professional Handler</option>
              <option value="owner-handler">Owner-Handler</option>
              <option value="kennel-owner">Kennel / Cattery Owner</option>
              <option value="photographer">Photographer</option>
              <option value="show-secretary">Show Secretary / Organiser</option>
              <option value="club-admin">Club Admin</option>
              <option value="judge">Judge</option>
              <option value="influencer">Dog Sport Influencer</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>
        <Field label="Breeds / Dogs">
          <input className={inp} value={contact.breeds ?? ""} onChange={e => set("breeds", e.target.value)} placeholder="e.g. Border Collie, Halloumi" />
        </Field>
        <Field label="Dog / Kennel name">
          <input className={inp} value={contact.dog_kennel ?? ""} onChange={e => set("dog_kennel", e.target.value)} placeholder="e.g. Vanitonia, Fandabidozi" />
        </Field>
      </Section>

      {/* ── Outreach ── */}
      <Section title="Outreach">
        <Field label="Why speak to them">
          <textarea className={tex} rows={2} value={contact.why_contact ?? ""} onChange={e => set("why_contact", e.target.value)} placeholder="Hypothesis to test, research angle…" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email">
            <input type="email" className={inp} value={contact.email ?? ""} onChange={e => set("email", e.target.value)} placeholder="name@example.com" />
          </Field>
          <Field label="Phone">
            <input type="tel" className={inp} value={contact.phone ?? ""} onChange={e => set("phone", e.target.value)} placeholder="+44 7700 000000" />
          </Field>
        </div>
        <Field label="Contact route">
          <input className={inp} value={contact.contact_route ?? ""} onChange={e => set("contact_route", e.target.value)} placeholder="Instagram, email, club intro, LinkedIn…" />
        </Field>
        <Field label="Warm intro?">
          <input className={inp} value={contact.warm_intro ?? ""} onChange={e => set("warm_intro", e.target.value)} placeholder="Who can introduce you?" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Source URL 1">
            <input className={inp} value={contact.source_url_1 ?? ""} onChange={e => set("source_url_1", e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="Source URL 2">
            <input className={inp} value={contact.source_url_2 ?? ""} onChange={e => set("source_url_2", e.target.value)} placeholder="https://…" />
          </Field>
        </div>
      </Section>

      {/* ── Pipeline ── */}
      <Section title="Pipeline">
        <Field label="Status">
          <select className={sel} value={contact.status ?? "identified"} onChange={e => set("status", e.target.value)}>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Outreach sent">
            <input type="date" className={inp} value={dateVal(contact.outreach_sent_date)} onChange={e => set("outreach_sent_date", e.target.value || null)} />
          </Field>
          <Field label="Follow-up date">
            <input type="date" className={inp} value={dateVal(contact.follow_up_date)} onChange={e => set("follow_up_date", e.target.value || null)} />
          </Field>
          <Field label="Call date">
            <input type="date" className={inp} value={dateVal(contact.interview_date)} onChange={e => set("interview_date", e.target.value || null)} />
          </Field>
          <Field label="Call outcome">
            <select className={sel} value={contact.call_outcome ?? ""} onChange={e => set("call_outcome", e.target.value)}>
              {CALL_OUTCOMES.map(o => <option key={o} value={o}>{o || "—"}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Next action">
          <textarea className={tex} rows={2} value={contact.next_action ?? ""} onChange={e => set("next_action", e.target.value)} placeholder="Specific next step…" />
        </Field>
      </Section>

      {/* ── Discovery ── */}
      <Section title="Discovery">
        <Field label="Key pain points">
          <textarea className={tex} rows={3} value={contact.key_pain_points ?? ""} onChange={e => set("key_pain_points", e.target.value)} placeholder="What they actually said…" />
        </Field>
        <Field label="Current workaround">
          <input className={inp} value={contact.current_workaround ?? ""} onChange={e => set("current_workaround", e.target.value)} placeholder="Spreadsheet, Facebook posts, phone notes, KC portal…" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Reaction to Pawdium">
            <select className={sel} value={contact.reaction ?? ""} onChange={e => set("reaction", e.target.value)}>
              {REACTIONS.map(r => <option key={r} value={r}>{r || "—"}</option>)}
            </select>
          </Field>
          <Field label="Willingness to pay">
            <select className={sel} value={contact.willingness_to_pay ?? ""} onChange={e => set("willingness_to_pay", e.target.value)}>
              {PAYS.map(p => <option key={p} value={p}>{p || "—"}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      {/* ── Scoring ── */}
      <Section title="Scoring">
        <ScoreRow label="Activity Level"      value={contact.activity_score ?? 1}     onChange={v => set("activity_score", v)}     hint="How active in shows / agility" />
        <ScoreRow label="Credibility"         value={contact.credibility_score ?? 1}  onChange={v => set("credibility_score", v)}  hint="How respected / visible" />
        <ScoreRow label="Product Fit"         value={contact.product_fit_score ?? 1}  onChange={v => set("product_fit_score", v)}  hint="How clearly Pawdium solves a real need" />
        <ScoreRow label="Champion Potential"  value={contact.champion_potential ?? 1} onChange={v => set("champion_potential", v)} hint="Likely to refer / share publicly" />

        <div className="flex items-center justify-between px-4 py-3 rounded-lg mt-1"
          style={{ background: "rgba(17,16,20,0.5)", border: `1px solid ${sc}35` }}>
          <div>
            <span className="text-sm text-stone/50">Beta Priority Score</span>
            <span className="text-xs text-stone/30 ml-2">= Activity + Credibility + Fit + Champion</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold" style={{ color: sc }}>{totalScore}</span>
            <span className="text-sm text-stone/30">/20</span>
            <div className="text-xs mt-0.5" style={{ color: sc }}>{sl}</div>
          </div>
        </div>
      </Section>

      {/* ── Notes ── */}
      <Section title="Notes">
        <textarea className={tex} rows={5} value={contact.notes ?? ""} onChange={e => set("notes", e.target.value)} placeholder="Free notes, observations, context…" />
      </Section>

      {/* Bottom save */}
      <div className="flex gap-3 pb-16">
        <button onClick={save} disabled={saving}
          className="flex-1 py-3.5 rounded-xl font-semibold text-plum-900 disabled:opacity-60 text-sm"
          style={{ background: "linear-gradient(135deg,#EDD98A,#C9A24A)" }}>
          {saving ? "Saving…" : savedOk ? "Saved ✓" : isNew ? "Create Contact" : "Save Changes"}
        </button>
        {!isNew && (
          <button onClick={del} disabled={deleting}
            className="px-5 py-3.5 rounded-xl text-sm text-red-400/50 hover:text-red-400 border border-red-900/25 hover:border-red-900/50 transition-colors">
            {deleting ? "…" : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
}
