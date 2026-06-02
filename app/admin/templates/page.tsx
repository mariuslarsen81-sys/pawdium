"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { OutreachTemplate, TEMPLATE_TYPES } from "@/lib/discoveryDb";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<OutreachTemplate[]>([]);
  const [loading,  setLoading]    = useState(true);
  const [seeding,  setSeeding]    = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/templates");
    if (res.ok) setTemplates(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function seed() {
    setSeeding(true);
    await fetch("/api/admin/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed: true }),
    });
    await load();
    setSeeding(false);
  }

  const grouped = TEMPLATE_TYPES.map(t => ({
    ...t,
    items: templates.filter(x => x.type === t.value),
  }));

  return (
    <div className="px-5 py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ivory">Outreach Templates</h1>
          <p className="text-stone/35 text-xs mt-0.5">{templates.length} template{templates.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/templates/new"
          className="text-sm font-semibold px-4 py-2 rounded-lg text-plum-900"
          style={{ background: "linear-gradient(135deg,#EDD98A,#C9A24A)" }}>
          + New Template
        </Link>
      </div>

      {loading && <div className="text-center py-20 text-stone/35 text-sm">Loading…</div>}

      {!loading && templates.length === 0 && (
        <div className="text-center py-20 bg-plum-800 rounded-2xl border border-plum-700">
          <div className="text-4xl mb-4">✉️</div>
          <p className="text-ivory font-semibold mb-2">No templates yet</p>
          <p className="text-stone/40 text-sm mb-6 max-w-xs mx-auto">
            Load the 6 starter templates (show, agility, BOH, photographer, organiser, follow-up).
          </p>
          <button onClick={seed} disabled={seeding}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-plum-900 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#EDD98A,#C9A24A)" }}>
            {seeding ? "Loading…" : "Load starter templates"}
          </button>
        </div>
      )}

      {!loading && templates.length > 0 && (
        <div className="space-y-4">
          {grouped.map(group => (
            group.items.length === 0 ? null : (
              <div key={group.value}>
                <h2 className="text-xs font-semibold text-stone/35 uppercase tracking-widest mb-2 px-1">{group.label}</h2>
                {group.items.map(t => (
                  <Link key={t.id} href={`/admin/templates/${t.id}`}
                    className="block bg-plum-800 border border-plum-700 rounded-xl p-4 mb-2 hover:border-gold-600/40 transition-colors group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-ivory text-sm mb-1">{t.label || t.type}</div>
                        {t.subject && <div className="text-xs text-stone/45 mb-2">{t.subject}</div>}
                        <div className="text-xs text-stone/35 line-clamp-2 leading-relaxed">{t.body}</div>
                      </div>
                      <span className="text-xs text-gold-500/60 group-hover:text-gold-400 transition-colors flex-shrink-0 font-medium mt-0.5">
                        Edit →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
