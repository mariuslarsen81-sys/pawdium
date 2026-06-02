"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OutreachTemplate, TEMPLATE_TYPES } from "@/lib/discoveryDb";

const BLANK: Partial<OutreachTemplate> = { type: "", label: "", subject: "", body: "" };

const inp = "w-full px-3 py-2.5 rounded-lg bg-plum-700 border border-plum-500 text-ivory text-sm placeholder-stone/45 focus:outline-none focus:border-gold-500";
const sel = `${inp} cursor-pointer`;

export default function TemplatePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isNew  = params.id === "new";

  const [tmpl,    setTmpl]    = useState<Partial<OutreachTemplate>>(BLANK);
  const [loading,  setLoading]  = useState(!isNew);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savedOk,  setSavedOk]  = useState(false);
  const [err,      setErr]      = useState("");
  const [copied,   setCopied]   = useState(false);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/templates/${params.id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setTmpl(d); setLoading(false); })
      .catch(() => { setErr("Failed to load."); setLoading(false); });
  }, [params.id, isNew]);

  const set = (field: keyof OutreachTemplate, value: string) =>
    setTmpl(prev => ({ ...prev, [field]: value }));

  async function save() {
    setSaving(true); setErr("");
    try {
      const url    = isNew ? "/api/admin/templates" : `/api/admin/templates/${params.id}`;
      const method = isNew ? "POST" : "PATCH";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(tmpl) });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      if (isNew) { router.push(`/admin/templates/${saved.id}`); }
      else { setTmpl(saved); setSavedOk(true); setTimeout(() => setSavedOk(false), 2500); }
    } catch { setErr("Save failed."); }
    setSaving(false);
  }

  async function del() {
    if (!confirm("Delete this template?")) return;
    setDeleting(true);
    await fetch(`/api/admin/templates/${params.id}`, { method: "DELETE" });
    router.push("/admin/templates");
  }

  async function copy() {
    await navigator.clipboard.writeText(tmpl.body ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return <div className="text-center py-20 text-stone/35 text-sm">Loading…</div>;

  return (
    <div className="px-5 py-8 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/admin/templates" className="text-stone/35 hover:text-stone/60 transition-colors text-sm flex-shrink-0">
            ← Templates
          </Link>
          <span className="text-stone/20 text-sm">/</span>
          <span className="text-ivory text-sm truncate">{isNew ? "New template" : (tmpl.label || tmpl.type || "Template")}</span>
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

      <div className="bg-plum-800 border border-plum-700 rounded-xl p-5 mb-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs text-stone/70 mb-1.5">Type</label>
            <select className={sel} value={tmpl.type ?? ""} onChange={e => set("type", e.target.value)}>
              <option value="">—</option>
              {TEMPLATE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-stone/70 mb-1.5">Label</label>
            <input className={inp} value={tmpl.label ?? ""} onChange={e => set("label", e.target.value)} placeholder="Short display name" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs text-stone/70 mb-1.5">Subject line</label>
          <input className={inp} value={tmpl.subject ?? ""} onChange={e => set("subject", e.target.value)} placeholder="Email subject…" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs text-stone/70">Message body</label>
            {!isNew && tmpl.body && (
              <button onClick={copy} className="text-xs text-gold-500/60 hover:text-gold-400 transition-colors">
                {copied ? "Copied ✓" : "Copy"}
              </button>
            )}
          </div>
          <textarea
            className={`${inp} resize-none font-mono`}
            rows={20}
            value={tmpl.body ?? ""}
            onChange={e => set("body", e.target.value)}
            placeholder="Use [Name], [Dog], [recent achievement] as placeholders…"
          />
          <p className="text-xs text-stone/25 mt-1.5">Use [Name], [Dog], [Kennel], [recent achievement] as placeholders</p>
        </div>
      </div>

      <div className="flex gap-3 pb-16">
        <button onClick={save} disabled={saving}
          className="flex-1 py-3.5 rounded-xl font-semibold text-plum-900 disabled:opacity-60 text-sm"
          style={{ background: "linear-gradient(135deg,#EDD98A,#C9A24A)" }}>
          {saving ? "Saving…" : savedOk ? "Saved ✓" : isNew ? "Create Template" : "Save Changes"}
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
