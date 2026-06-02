"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { DiscoveryContact, STATUSES, DISCIPLINES, scoreColor } from "@/lib/discoveryDb";

function DisciplineLabel({ value }: { value: string }) {
  const map: Record<string, string> = { show: "Show", agility: "Agility", both: "Both", other: "Other" };
  return <>{map[value] ?? value}</>;
}

export default function DiscoveryPage() {
  const [contacts, setContacts]           = useState<DiscoveryContact[]>([]);
  const [loading, setLoading]             = useState(true);
  const [statusFilter, setStatusFilter]   = useState("");
  const [disciplineFilter, setDiscipline] = useState("");
  const [search, setSearch]               = useState("");
  const [seeding, setSeeding]             = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/discovery");
    if (res.ok) setContacts(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function quickStatus(id: number, newStatus: string) {
    const c = contacts.find(x => x.id === id);
    if (!c) return;
    setContacts(prev => prev.map(x => x.id === id ? { ...x, status: newStatus } : x));
    await fetch(`/api/admin/discovery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...c, status: newStatus }),
    });
  }

  async function seed() {
    setSeeding(true);
    await fetch("/api/admin/discovery/seed", { method: "POST" });
    await load();
    setSeeding(false);
  }

  const filtered = useMemo(() => contacts.filter(c => {
    if (statusFilter    && c.status     !== statusFilter)    return false;
    if (disciplineFilter && c.discipline !== disciplineFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [contacts, statusFilter, disciplineFilter, search]);

  const stageCounts = useMemo(() => {
    const m: Record<string, number> = {};
    contacts.forEach(c => { m[c.status] = (m[c.status] ?? 0) + 1; });
    return m;
  }, [contacts]);

  const priorityCount = contacts.filter(c => (c.total_score ?? 0) >= 17).length;

  const inputCls = "px-3 py-2 rounded-lg bg-plum-800 border border-plum-700 text-ivory text-sm placeholder-stone/50 focus:outline-none focus:border-gold-500";

  return (
    <div className="px-5 py-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-ivory">Discovery CRM</h1>
          <p className="text-stone/35 text-xs mt-0.5">
            {contacts.length} contacts{priorityCount > 0 ? ` · ${priorityCount} must-speak-to` : ""}
          </p>
        </div>
        <Link
          href="/admin/discovery/new"
          className="text-sm font-semibold px-4 py-2 rounded-lg text-plum-900"
          style={{ background: "linear-gradient(135deg, #EDD98A 0%, #C9A24A 100%)" }}
        >
          + Add Contact
        </Link>
      </div>

      {/* Stage pills */}
      {contacts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {STATUSES.filter(s => stageCounts[s.value]).map(s => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(prev => prev === s.value ? "" : s.value)}
              className="text-xs px-2.5 py-1 rounded-full font-medium transition-all"
              style={{
                color: s.color,
                background: `${s.color}18`,
                border: `1px solid ${s.color}${statusFilter === s.value ? "80" : "35"}`,
                opacity: statusFilter && statusFilter !== s.value ? 0.4 : 1,
              }}
            >
              {s.label} {stageCounts[s.value]}
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`${inputCls} flex-1 min-w-[160px]`}
        />
        <select value={disciplineFilter} onChange={e => setDiscipline(e.target.value)} className={inputCls}>
          <option value="">All disciplines</option>
          {DISCIPLINES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
        {(statusFilter || disciplineFilter || search) && (
          <button
            onClick={() => { setStatusFilter(""); setDiscipline(""); setSearch(""); }}
            className={`${inputCls} text-stone/50 hover:text-stone/80 transition-colors`}
          >
            Clear
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20 text-stone/35 text-sm">Loading…</div>
      )}

      {/* Empty state */}
      {!loading && contacts.length === 0 && (
        <div className="text-center py-20 bg-plum-800 rounded-2xl border border-plum-700">
          <div className="text-4xl mb-4">🐾</div>
          <p className="text-ivory font-semibold mb-2">No contacts yet</p>
          <p className="text-stone/40 text-sm mb-6 max-w-xs mx-auto">
            Load the 10 discovery contacts from your brief, or add people manually.
          </p>
          <button
            onClick={seed}
            disabled={seeding}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-plum-900 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #EDD98A 0%, #C9A24A 100%)" }}
          >
            {seeding ? "Loading…" : "Load initial 10 contacts"}
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="bg-plum-800 rounded-2xl border border-plum-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-plum-700">
                <th className="text-left px-4 py-3 text-xs text-stone/35 font-medium w-auto">Name</th>
                <th className="text-left px-4 py-3 text-xs text-stone/35 font-medium hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs text-stone/35 font-medium hidden md:table-cell w-16">Score</th>
                <th className="text-left px-4 py-3 text-xs text-stone/35 font-medium hidden lg:table-cell">Next action</th>
                <th className="px-4 py-3 w-12" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const score = c.total_score ?? (c.activity_score + c.credibility_score + c.product_fit_score);
                const statusCfg = STATUSES.find(s => s.value === c.status);
                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-plum-700/30 transition-colors ${i < filtered.length - 1 ? "border-b border-plum-700/50" : ""}`}
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-ivory text-sm leading-tight">{c.name}</div>
                      <div className="text-stone/35 text-xs mt-0.5">
                        {[c.discipline ? <DisciplineLabel key="d" value={c.discipline} /> : null, c.market || null]
                          .filter(Boolean)
                          .reduce<React.ReactNode[]>((acc, el, idx) => idx === 0 ? [el] : [...acc, " · ", el], [])}
                      </div>
                    </td>

                    {/* Status — inline quick-change */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <select
                        value={c.status}
                        onChange={e => quickStatus(c.id, e.target.value)}
                        className="text-xs rounded-full px-2.5 py-1 font-medium focus:outline-none cursor-pointer"
                        style={{
                          color: statusCfg?.color ?? "#9CA3AF",
                          background: `${statusCfg?.color ?? "#9CA3AF"}18`,
                          border: `1px solid ${statusCfg?.color ?? "#9CA3AF"}40`,
                        }}
                      >
                        {STATUSES.map(s => (
                          <option key={s.value} value={s.value} style={{ color: "#F7F2E8", background: "#22102F" }}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Score */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm font-bold tabular-nums" style={{ color: scoreColor(score) }}>
                        {score}/20
                      </span>
                    </td>

                    {/* Next action */}
                    <td className="px-4 py-3 hidden lg:table-cell max-w-[220px]">
                      <span className="text-xs text-stone/40 truncate block">{c.next_action || "—"}</span>
                    </td>

                    {/* Edit */}
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/discovery/${c.id}`}
                        className="text-xs text-gold-500 hover:text-gold-300 transition-colors font-medium whitespace-nowrap"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Filter empty */}
      {!loading && contacts.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12 text-stone/35 text-sm">
          No contacts match the current filters.
        </div>
      )}
    </div>
  );
}
