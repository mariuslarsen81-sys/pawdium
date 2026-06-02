import { getDiscoveryDb, STATUSES, REACTIONS, scoreColor, scoreLabel } from "@/lib/discoveryDb";

export const dynamic = "force-dynamic";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-plum-800 border border-plum-700 rounded-xl p-4 text-center">
      <div className="text-2xl font-bold text-gold-400 mb-0.5">{value}</div>
      <div className="text-xs text-stone/50">{label}</div>
      {sub && <div className="text-xs text-stone/30 mt-0.5">{sub}</div>}
    </div>
  );
}

export default async function InsightsPage() {
  const sql = await getDiscoveryDb();

  const [contacts, interviews, statusRows, disciplineRows, reactionRows, topContacts, payRows] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM discovery_contacts`,
    sql`SELECT COUNT(*)::int AS count FROM interview_notes`,
    sql`SELECT status, COUNT(*)::int AS count FROM discovery_contacts GROUP BY status ORDER BY count DESC`,
    sql`SELECT discipline, COUNT(*)::int AS count FROM discovery_contacts WHERE discipline != '' GROUP BY discipline ORDER BY count DESC`,
    sql`SELECT reaction_pawdium AS reaction, COUNT(*)::int AS count FROM interview_notes WHERE reaction_pawdium != '' GROUP BY reaction_pawdium ORDER BY count DESC`,
    sql`SELECT name, (activity_score + credibility_score + product_fit_score + champion_potential) AS score, status, discipline FROM discovery_contacts ORDER BY score DESC LIMIT 5`,
    sql`SELECT would_pay, COUNT(*)::int AS count FROM interview_notes WHERE would_pay != '' GROUP BY would_pay ORDER BY count DESC`,
  ]);

  const totalContacts  = contacts[0]?.count ?? 0;
  const totalInterviews = interviews[0]?.count ?? 0;
  const mustSpeakTo    = await sql`SELECT COUNT(*)::int AS count FROM discovery_contacts WHERE (activity_score + credibility_score + product_fit_score + champion_potential) >= 17`;
  const contacted      = await sql`SELECT COUNT(*)::int AS count FROM discovery_contacts WHERE status IN ('contacted','replied','call-booked','interviewed','beta-candidate','champion')`;
  const quotes         = await sql`SELECT contact_name, quote, reaction_pawdium FROM interview_notes WHERE quote != '' ORDER BY created_at DESC LIMIT 5`;
  const painPoints     = await sql`SELECT biggest_pain FROM interview_notes WHERE biggest_pain != '' ORDER BY created_at DESC LIMIT 10`;
  const features       = await sql`SELECT must_have_features FROM interview_notes WHERE must_have_features != '' ORDER BY created_at DESC LIMIT 10`;

  return (
    <div className="px-5 py-8 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-ivory mb-6">Insights</h1>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Contacts" value={totalContacts} />
        <StatCard label="Interviews" value={totalInterviews} />
        <StatCard label="Must-speak-to" value={mustSpeakTo[0]?.count ?? 0} sub="score 17–20" />
        <StatCard label="In pipeline" value={contacted[0]?.count ?? 0} sub="contacted or later" />
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">

        {/* Pipeline */}
        <div className="bg-plum-800 border border-plum-700 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ivory mb-4">Pipeline</h2>
          <div className="space-y-2">
            {STATUSES.map(s => {
              const row = statusRows.find((r: { status: string }) => r.status === s.value);
              const count = row?.count ?? 0;
              if (!count) return null;
              const pct = totalContacts > 0 ? Math.round(count / totalContacts * 100) : 0;
              return (
                <div key={s.value} className="flex items-center gap-3">
                  <div className="w-24 text-xs flex-shrink-0" style={{ color: s.color }}>{s.label}</div>
                  <div className="flex-1 h-2 rounded-full bg-plum-700 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: s.color, opacity: 0.6 }} />
                  </div>
                  <div className="w-8 text-right text-xs text-stone/40">{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Discipline split */}
        <div className="bg-plum-800 border border-plum-700 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ivory mb-4">Discipline split</h2>
          {disciplineRows.length === 0
            ? <p className="text-stone/35 text-sm">No data yet.</p>
            : (
              <div className="space-y-3">
                {disciplineRows.map((r: { discipline: string; count: number }) => (
                  <div key={r.discipline} className="flex items-center gap-3">
                    <div className="w-16 text-xs text-stone/50 capitalize flex-shrink-0">{r.discipline}</div>
                    <div className="flex-1 h-2 rounded-full bg-plum-700 overflow-hidden">
                      <div className="h-full rounded-full bg-gold-500/50"
                        style={{ width: `${Math.round(r.count / totalContacts * 100)}%` }} />
                    </div>
                    <div className="w-8 text-right text-xs text-stone/40">{r.count}</div>
                  </div>
                ))}
              </div>
            )}

          <h2 className="text-sm font-semibold text-ivory mt-6 mb-4">Reaction to Pawdium</h2>
          {reactionRows.length === 0
            ? <p className="text-stone/35 text-sm">No interviews logged yet.</p>
            : (
              <div className="space-y-2">
                {reactionRows.map((r: { reaction: string; count: number }) => {
                  const cfg = REACTIONS.find(x => x.value === r.reaction);
                  return (
                    <div key={r.reaction} className="flex items-center gap-3">
                      <div className="w-24 text-xs flex-shrink-0" style={{ color: cfg?.color ?? "#9CA3AF" }}>
                        {cfg?.label ?? r.reaction}
                      </div>
                      <div className="flex-1 h-2 rounded-full bg-plum-700 overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width: `${Math.round(r.count / totalInterviews * 100)}%`, background: cfg?.color ?? "#9CA3AF", opacity: 0.6 }} />
                      </div>
                      <div className="w-8 text-right text-xs text-stone/40">{r.count}</div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* Top contacts */}
      <div className="bg-plum-800 border border-plum-700 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-ivory mb-4">Top 5 by Priority Score</h2>
        {topContacts.length === 0
          ? <p className="text-stone/35 text-sm">No contacts yet.</p>
          : (
            <div className="space-y-2">
              {topContacts.map((c: { name: string; score: number; status: string; discipline: string }, i: number) => {
                const sc = scoreColor(c.score);
                const sl = scoreLabel(c.score);
                const st = STATUSES.find(s => s.value === c.status);
                return (
                  <div key={i} className="flex items-center gap-3 py-1">
                    <span className="w-5 text-xs text-stone/30 text-right flex-shrink-0">{i + 1}</span>
                    <span className="flex-1 text-sm text-ivory font-medium">{c.name}</span>
                    <span className="text-xs capitalize text-stone/40 hidden sm:inline">{c.discipline || "—"}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full hidden md:inline"
                      style={{ color: st?.color ?? "#9CA3AF", background: `${st?.color ?? "#9CA3AF"}18` }}>
                      {st?.label ?? c.status}
                    </span>
                    <span className="text-sm font-bold w-12 text-right flex-shrink-0" style={{ color: sc }}>
                      {c.score}/20
                    </span>
                    <span className="text-xs w-20 text-right flex-shrink-0" style={{ color: sc }}>{sl}</span>
                  </div>
                );
              })}
            </div>
          )}
      </div>

      {/* Willingness to pay */}
      {payRows.length > 0 && (
        <div className="bg-plum-800 border border-plum-700 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-ivory mb-4">Willingness to Pay</h2>
          <div className="space-y-2">
            {payRows.map((r: { would_pay: string; count: number }) => (
              <div key={r.would_pay} className="flex items-center gap-3">
                <div className="flex-1 text-sm text-stone/60">{r.would_pay}</div>
                <div className="text-sm font-bold text-gold-400">{r.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">

        {/* Pain points */}
        <div className="bg-plum-800 border border-plum-700 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ivory mb-4">Recent Pain Points</h2>
          {painPoints.length === 0
            ? <p className="text-stone/35 text-sm">No interviews logged yet.</p>
            : (
              <div className="space-y-3">
                {painPoints.map((p: { biggest_pain: string }, i: number) => (
                  <div key={i} className="text-sm text-stone/55 border-l-2 border-plum-600 pl-3 leading-relaxed">
                    {p.biggest_pain}
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Quotes */}
        <div className="bg-plum-800 border border-plum-700 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ivory mb-4">Quotes</h2>
          {quotes.length === 0
            ? <p className="text-stone/35 text-sm">No quotes logged yet.</p>
            : (
              <div className="space-y-4">
                {quotes.map((q: { contact_name: string; quote: string; reaction_pawdium: string }, i: number) => {
                  const r = REACTIONS.find(x => x.value === q.reaction_pawdium);
                  return (
                    <div key={i}>
                      <p className="text-sm text-stone/60 italic leading-relaxed">&ldquo;{q.quote}&rdquo;</p>
                      <p className="text-xs mt-1" style={{ color: r?.color ?? "#9CA3AF" }}>
                        — {q.contact_name || "Unknown"}
                        {r?.label ? ` · ${r.label}` : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* Feature requests */}
      {features.length > 0 && (
        <div className="bg-plum-800 border border-plum-700 rounded-xl p-5 mt-6">
          <h2 className="text-sm font-semibold text-ivory mb-4">Feature Requests (raw)</h2>
          <div className="space-y-3">
            {features.map((f: { must_have_features: string }, i: number) => (
              <div key={i} className="text-sm text-stone/55 border-l-2 border-gold-600/30 pl-3 leading-relaxed">
                {f.must_have_features}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
