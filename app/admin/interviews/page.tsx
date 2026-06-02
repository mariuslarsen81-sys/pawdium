"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { InterviewNote, REACTIONS } from "@/lib/discoveryDb";

function ReactionBadge({ value }: { value: string }) {
  const r = REACTIONS.find(x => x.value === value);
  if (!r || !r.value) return <span className="text-stone/30 text-xs">—</span>;
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ color: r.color, background: `${r.color}18`, border: `1px solid ${r.color}30` }}>
      {r.label}
    </span>
  );
}

export default function InterviewsPage() {
  const [notes, setNotes]   = useState<InterviewNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/interviews")
      .then(r => r.json())
      .then(d => { setNotes(d); setLoading(false); });
  }, []);

  return (
    <div className="px-5 py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ivory">Interview Notes</h1>
          <p className="text-stone/35 text-xs mt-0.5">{notes.length} conversation{notes.length !== 1 ? "s" : ""} logged</p>
        </div>
        <Link href="/admin/interviews/new"
          className="text-sm font-semibold px-4 py-2 rounded-lg text-plum-900"
          style={{ background: "linear-gradient(135deg,#EDD98A,#C9A24A)" }}>
          + Log Interview
        </Link>
      </div>

      {loading && <div className="text-center py-20 text-stone/35 text-sm">Loading…</div>}

      {!loading && notes.length === 0 && (
        <div className="text-center py-20 bg-plum-800 rounded-2xl border border-plum-700">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-ivory font-semibold mb-2">No interviews logged yet</p>
          <p className="text-stone/40 text-sm mb-6 max-w-xs mx-auto">
            After each discovery call, log the conversation here. This is where the learning lives.
          </p>
          <Link href="/admin/interviews/new"
            className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold text-plum-900"
            style={{ background: "linear-gradient(135deg,#EDD98A,#C9A24A)" }}>
            Log first interview
          </Link>
        </div>
      )}

      {notes.length > 0 && (
        <div className="bg-plum-800 rounded-2xl border border-plum-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-plum-700">
                <th className="text-left px-4 py-3 text-xs text-stone/35 font-medium">Contact</th>
                <th className="text-left px-4 py-3 text-xs text-stone/35 font-medium hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs text-stone/35 font-medium hidden md:table-cell">Reaction</th>
                <th className="text-left px-4 py-3 text-xs text-stone/35 font-medium hidden lg:table-cell">Quote</th>
                <th className="px-4 py-3 w-12" />
              </tr>
            </thead>
            <tbody>
              {notes.map((n, i) => (
                <tr key={n.id}
                  className={`hover:bg-plum-700/30 transition-colors ${i < notes.length - 1 ? "border-b border-plum-700/50" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ivory text-sm">{n.contact_name || "Unknown"}</div>
                    {n.discipline && <div className="text-stone/35 text-xs mt-0.5 capitalize">{n.discipline}</div>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-stone/50 text-sm">{n.date ? String(n.date).substring(0, 10) : "—"}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <ReactionBadge value={n.reaction_pawdium} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell max-w-[260px]">
                    {n.quote
                      ? <span className="text-xs text-stone/45 italic truncate block">&ldquo;{n.quote}&rdquo;</span>
                      : <span className="text-stone/25 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/interviews/${n.id}`}
                      className="text-xs text-gold-500 hover:text-gold-300 transition-colors font-medium">
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
