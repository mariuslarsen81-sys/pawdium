"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InterviewNote, REACTIONS } from "@/lib/discoveryDb";

function dateVal(v: string | null | undefined) {
  if (!v) return "";
  return String(v).substring(0, 10);
}

const PAYS = ["", "No", "Maybe", "Yes — unclear amount", "Yes — £5/mo", "Yes — £10/mo", "Yes — £15+/mo"];

const BLANK: Partial<InterviewNote> = {
  contact_id: null, contact_name: "", date: null, discipline: "",
  current_workaround: "", biggest_pain: "", what_tracks_today: "", what_shares_today: "",
  reaction_pawdium: "", reaction_result_cards: "", reaction_achievement_rack: "", reaction_show_diary: "",
  verification_concerns: "", would_pay: "", price_reaction: "",
  must_have_features: "", objections: "", quote: "", follow_up_action: "",
};

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

function ReactionSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const r = REACTIONS.find(x => x.value === value);
  return (
    <Field label={label}>
      <select
        className={sel}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ color: r?.color ?? undefined }}
      >
        {REACTIONS.map(rx => (
          <option key={rx.value} value={rx.value} style={{ color: "#F7F2E8", background: "#22102F" }}>
            {rx.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export default function InterviewPage({ params }: { params: { id: string } }) {
  const router  = useRouter();
  const isNew   = params.id === "new";

  const [note,    setNote]    = useState<Partial<InterviewNote>>(BLANK);
  const [contacts, setContacts] = useState<{ id: number; name: string }[]>([]);
  const [loading,  setLoading]  = useState(!isNew);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savedOk,  setSavedOk]  = useState(false);
  const [err,      setErr]      = useState("");

  // Load contacts for dropdown
  useEffect(() => {
    fetch("/api/admin/discovery")
      .then(r => r.json())
      .then(d => setContacts(d.map((c: { id: number; name: string }) => ({ id: c.id, name: c.name }))));
  }, []);

  // Load existing note
  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/interviews/${params.id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setNote(d); setLoading(false); })
      .catch(() => { setErr("Failed to load."); setLoading(false); });
  }, [params.id, isNew]);

  const set = useCallback((field: keyof InterviewNote, value: unknown) => {
    setNote(prev => ({ ...prev, [field]: value }));
  }, []);

  function handleContactChange(id: string) {
    const cid   = parseInt(id);
    const found = contacts.find(c => c.id === cid);
    setNote(prev => ({ ...prev, contact_id: cid || null, contact_name: found?.name ?? "" }));
  }

  async function save() {
    setSaving(true); setErr("");
    try {
      const url    = isNew ? "/api/admin/interviews" : `/api/admin/interviews/${params.id}`;
      const method = isNew ? "POST" : "PATCH";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(note) });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      if (isNew) { router.push(`/admin/interviews/${saved.id}`); }
      else { setNote(saved); setSavedOk(true); setTimeout(() => setSavedOk(false), 2500); }
    } catch { setErr("Save failed."); }
    setSaving(false);
  }

  async function del() {
    if (!confirm("Delete this interview note? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/admin/interviews/${params.id}`, { method: "DELETE" });
    router.push("/admin/interviews");
  }

  if (loading) return <div className="text-center py-20 text-stone/35 text-sm">Loading…</div>;

  return (
    <div className="px-5 py-8 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/admin/interviews" className="text-stone/35 hover:text-stone/60 transition-colors text-sm flex-shrink-0">
            ← Interviews
          </Link>
          <span className="text-stone/20 text-sm">/</span>
          <span className="text-ivory text-sm truncate">
            {isNew ? "New note" : (note.contact_name || "Interview")}
          </span>
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

      {/* ── Context ── */}
      <Section title="Call Context">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Contact">
            <select className={sel} value={note.contact_id ?? ""} onChange={e => handleContactChange(e.target.value)}>
              <option value="">— Select contact —</option>
              {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Contact name (manual)">
            <input className={inp} value={note.contact_name ?? ""} onChange={e => set("contact_name", e.target.value)} placeholder="Or type a name" />
          </Field>
          <Field label="Date">
            <input type="date" className={inp} value={dateVal(note.date)} onChange={e => set("date", e.target.value || null)} />
          </Field>
          <Field label="Discipline">
            <select className={sel} value={note.discipline ?? ""} onChange={e => set("discipline", e.target.value)}>
              <option value="">—</option>
              <option value="show">Show</option>
              <option value="agility">Agility</option>
              <option value="both">Both</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* ── What they said ── */}
      <Section title="What They Said">
        <Field label="Current workaround">
          <textarea className={tex} rows={2} value={note.current_workaround ?? ""} onChange={e => set("current_workaround", e.target.value)} placeholder="Spreadsheet, Facebook posts, phone notes, KC portal…" />
        </Field>
        <Field label="Biggest pain">
          <textarea className={tex} rows={2} value={note.biggest_pain ?? ""} onChange={e => set("biggest_pain", e.target.value)} placeholder="The thing that frustrates them most…" />
        </Field>
        <Field label="What they track today">
          <textarea className={tex} rows={2} value={note.what_tracks_today ?? ""} onChange={e => set("what_tracks_today", e.target.value)} placeholder="Results, ribbons, health certs, titles…" />
        </Field>
        <Field label="What they share today">
          <textarea className={tex} rows={2} value={note.what_shares_today ?? ""} onChange={e => set("what_shares_today", e.target.value)} placeholder="Facebook posts, Instagram, club newsletter…" />
        </Field>
        <Field label="Verification concerns">
          <textarea className={tex} rows={2} value={note.verification_concerns ?? ""} onChange={e => set("verification_concerns", e.target.value)} placeholder="Did they raise concerns about data accuracy, KC verification…" />
        </Field>
      </Section>

      {/* ── Reactions ── */}
      <Section title="Reactions">
        <div className="grid grid-cols-2 gap-3">
          <ReactionSelect label="Reaction to Pawdium"             value={note.reaction_pawdium ?? ""}          onChange={v => set("reaction_pawdium", v)} />
          <ReactionSelect label="Reaction to Result Cards"        value={note.reaction_result_cards ?? ""}     onChange={v => set("reaction_result_cards", v)} />
          <ReactionSelect label="Reaction to Achievement Rack"   value={note.reaction_achievement_rack ?? ""} onChange={v => set("reaction_achievement_rack", v)} />
          <ReactionSelect label="Reaction to Show Diary / Run Log" value={note.reaction_show_diary ?? ""}      onChange={v => set("reaction_show_diary", v)} />
        </div>
      </Section>

      {/* ── Willingness to pay ── */}
      <Section title="Willingness to Pay">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Would pay?">
            <select className={sel} value={note.would_pay ?? ""} onChange={e => set("would_pay", e.target.value)}>
              {PAYS.map(p => <option key={p} value={p}>{p || "—"}</option>)}
            </select>
          </Field>
          <Field label="Price reaction">
            <input className={inp} value={note.price_reaction ?? ""} onChange={e => set("price_reaction", e.target.value)} placeholder="What they said about pricing…" />
          </Field>
        </div>
      </Section>

      {/* ── Product signals ── */}
      <Section title="Product Signals">
        <Field label="Must-have features">
          <textarea className={tex} rows={3} value={note.must_have_features ?? ""} onChange={e => set("must_have_features", e.target.value)} placeholder="Features they explicitly asked for or said were essential…" />
        </Field>
        <Field label="Objections">
          <textarea className={tex} rows={2} value={note.objections ?? ""} onChange={e => set("objections", e.target.value)} placeholder="Why they might not use it, concerns raised…" />
        </Field>
        <Field label="Best quote">
          <textarea className={tex} rows={2} value={note.quote ?? ""} onChange={e => set("quote", e.target.value)} placeholder="The most useful or memorable thing they said…" />
        </Field>
      </Section>

      {/* ── Follow-up ── */}
      <Section title="Follow-up">
        <Field label="Follow-up action">
          <textarea className={tex} rows={2} value={note.follow_up_action ?? ""} onChange={e => set("follow_up_action", e.target.value)} placeholder="What you committed to doing next…" />
        </Field>
      </Section>

      {/* Bottom save */}
      <div className="flex gap-3 pb-16">
        <button onClick={save} disabled={saving}
          className="flex-1 py-3.5 rounded-xl font-semibold text-plum-900 disabled:opacity-60 text-sm"
          style={{ background: "linear-gradient(135deg,#EDD98A,#C9A24A)" }}>
          {saving ? "Saving…" : savedOk ? "Saved ✓" : isNew ? "Create Note" : "Save Changes"}
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
