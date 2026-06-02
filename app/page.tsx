"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { mockDogs } from "@/lib/mockDogs";

function RibbonSVG({ color, size = 48 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 48 67" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" fill={color} opacity="0.15" />
      <circle cx="24" cy="24" r="22" stroke={color} strokeWidth="2.5" />
      <circle cx="24" cy="24" r="16" fill={color} opacity="0.25" />
      <circle cx="24" cy="24" r="10" fill={color} opacity="0.5" />
      <polygon points="18,44 24,48 30,44 28,62 24,59 20,62" fill={color} opacity="0.7" />
      <polygon points="18,44 14,40 10,56 18,54" fill={color} opacity="0.5" />
      <polygon points="30,44 34,40 38,56 30,54" fill={color} opacity="0.5" />
    </svg>
  );
}

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [activity, setActivity] = useState("");
  const [dogCount, setDogCount] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, activity, dogCount }),
      });
      if (res.ok) setState("success");
      else setState("error");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="text-center py-8">
        <div className="text-3xl mb-3">🎖️</div>
        <h3 className="text-xl font-semibold text-gold-400 mb-2">You&apos;re on the list.</h3>
        <p className="text-stone text-sm">We&apos;ll be in touch when early access opens. Check your inbox.</p>
      </div>
    );
  }

  const selectClass = "w-full px-4 py-3.5 rounded-lg bg-plum-700 border border-plum-600 text-ivory focus:outline-none focus:border-gold-500 text-base";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3.5 rounded-lg bg-plum-700 border border-plum-600 text-ivory placeholder-stone/40 focus:outline-none focus:border-gold-500 text-base"
      />
      <select value={role} onChange={(e) => setRole(e.target.value)} className={selectClass}>
        <option value="">I am a… (optional)</option>
        <option value="exhibitor">Show Exhibitor</option>
        <option value="agility-handler">Agility Handler</option>
        <option value="breeder">Breeder</option>
        <option value="handler">Professional Handler</option>
        <option value="owner-handler">Owner-Handler</option>
        <option value="sport">Dog Sport Competitor</option>
        <option value="other">Other</option>
      </select>
      <select value={activity} onChange={(e) => setActivity(e.target.value)} className={selectClass}>
        <option value="">Primary activity… (optional)</option>
        <option value="show">Conformation / Show</option>
        <option value="agility">Agility</option>
        <option value="both">Both show and agility</option>
        <option value="other-sport">Other dog sport</option>
      </select>
      <select value={dogCount} onChange={(e) => setDogCount(e.target.value)} className={selectClass}>
        <option value="">Dogs you actively compete with… (optional)</option>
        <option value="1">1 dog</option>
        <option value="2-3">2–3 dogs</option>
        <option value="4+">4 or more dogs</option>
      </select>
      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full py-3.5 rounded-lg font-semibold text-plum-900 text-base transition-all disabled:opacity-70"
        style={{ background: "linear-gradient(135deg, #EDD98A 0%, #C9A24A 50%, #A8853A 100%)" }}
      >
        {state === "loading" ? "Joining…" : "Build your dog's Pawdium"}
      </button>
      {state === "error" && (
        <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

function DogPreviewCard({ dog }: { dog: typeof mockDogs[0] }) {
  return (
    <Link href={`/dogs/${dog.slug}`} className="block group">
      <div className="rounded-2xl border border-plum-600 bg-plum-800 overflow-hidden card-gold-glow transition-all duration-300 group-hover:border-gold-600 group-hover:scale-[1.02]">
        <div className="h-44 relative flex items-end px-5 pb-3 overflow-hidden">
          <Image src={dog.coverImage} alt={dog.callName} fill className="object-cover object-center" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(17,16,20,0.1), rgba(17,16,20,0.85))" }} />
          <div className="relative">
            <div className="text-2xl font-bold text-ivory font-serif">{dog.callName}</div>
            <div className="text-xs text-stone/70">{dog.breed}</div>
          </div>
          {dog.titles.length > 0 && (
            <div className="absolute top-3 right-3 flex gap-1 flex-wrap justify-end">
              {dog.titles.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "rgba(17,16,20,0.82)", border: "1px solid rgba(201,162,74,0.5)", color: "#E2C66D", backdropFilter: "blur(4px)" }}>
                  {t === "Show Champion" ? "ShCh" : t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="p-5">
          <p className="text-stone/70 text-sm leading-relaxed mb-4 line-clamp-2">{dog.bio}</p>
          <div className="flex gap-4 mb-4">
            {[
              { label: "CCs", value: dog.stats.ccs },
              { label: "RCCs", value: dog.stats.rccs },
              { label: "BOBs", value: dog.stats.bobs },
              { label: "Shows", value: dog.stats.shows },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-lg font-bold text-gold-400">{s.value}</div>
                <div className="text-xs text-stone/50">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-1 flex-wrap items-end">
            {dog.ribbons.slice(0, 8).map((r, i) => (
              <div key={i} title={r.label}>
                <RibbonSVG color={r.color} size={28} />
              </div>
            ))}
            {dog.ribbons.length > 8 && (
              <div className="w-7 h-7 rounded-full bg-plum-700 border border-plum-600 flex items-center justify-center text-xs text-stone/50 self-center">
                +{dog.ribbons.length - 8}
              </div>
            )}
          </div>
        </div>
        <div className="px-5 pb-4">
          <span className="text-xs text-gold-500 group-hover:text-gold-400 transition-colors font-medium">
            View Pawdium Profile →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-plum-900">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 h-14 border-b border-plum-700 bg-plum-900/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Pawdium" width={32} height={32} className="rounded-lg" />
          <span className="text-lg font-bold tracking-wide gold-gradient">Pawdium</span>
        </div>
        <a href="#waitlist"
          className="text-sm font-semibold px-4 py-1.5 rounded-lg border border-gold-600/50 text-gold-400 hover:bg-gold-500/10 transition-colors">
          Join Waitlist
        </a>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #3B1458, transparent 70%)" }} />
        </div>
        <div className="relative">
          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="Pawdium" width={80} height={80} className="rounded-2xl" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-600/30 text-gold-400 text-xs font-medium mb-6 tracking-wide">
            NOW TAKING EARLY ACCESS
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4 text-balance text-ivory">
            Every result.<br />
            Every ribbon.<br />
            <span className="gold-gradient">Every run.</span>
          </h1>
          <p className="text-stone/70 text-lg leading-relaxed mb-3 max-w-md mx-auto text-balance">
            Create a beautiful competition profile for your dog. Track show results and agility runs, build a digital ribbon rack, and share every milestone with the people who understand.
          </p>
          <p className="mb-8 max-w-sm mx-auto text-center leading-snug">
            <span className="text-stone/75 text-sm">Not another pet photo app.</span><br />
            <span className="text-stone/50 text-xs">A competition record your dog deserves.</span>
          </p>
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {["Show Exhibitors", "Agility Handlers", "Breeder-Owner-Handlers", "Kennel Owners"].map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-plum-700 border border-plum-600 text-stone/60">
                {tag}
              </span>
            ))}
          </div>
          <a href="#waitlist"
            className="inline-block px-8 py-4 rounded-xl font-semibold text-plum-900 text-base"
            style={{ background: "linear-gradient(135deg, #EDD98A 0%, #C9A24A 100%)" }}>
            Build your dog&apos;s Pawdium
          </a>
          <p className="text-stone/40 text-xs mt-3">From first class to Champion title. From first run to career milestone.</p>
        </div>
      </section>

      {/* Ribbon rack */}
      <section className="px-5 pb-16">
        <div className="max-w-sm mx-auto rounded-2xl border border-plum-600 bg-plum-800 p-6 card-glow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-ivory font-serif">Luna&apos;s Achievement Rack</div>
              <div className="text-xs text-stone/50">Show Champion · Border Collie</div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-600/30 font-medium">ShCh</span>
          </div>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {mockDogs[0].ribbons.map((r, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <RibbonSVG color={r.color} size={36} />
                <span className="text-center leading-tight" style={{ fontSize: "7px", color: r.color, opacity: 0.8 }}>
                  {r.year}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-plum-700">
            {[
              { label: "CCs", value: "7" },
              { label: "RCCs", value: "4" },
              { label: "BOBs", value: "12" },
              { label: "Shows", value: "34" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-base font-bold text-gold-400">{s.value}</div>
                <div className="text-xs text-stone/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agility Run Log */}
      <section className="px-5 pb-16">
        <div className="max-w-sm mx-auto rounded-2xl border border-plum-600 bg-plum-800 p-6 card-glow">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-ivory font-serif">Milo&apos;s Run Log</div>
              <div className="text-xs text-stone/50">Border Collie · Agility</div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full font-medium"
              style={{ background: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.35)", color: "#4ade80" }}>
              Grade 5
            </span>
          </div>

          {/* Run entries */}
          <div className="space-y-2 mb-4">
            {[
              { show: "Kenilworth DTC", date: "14 Jun", class: "Jumping · G5", time: "34.21s", faults: 0, place: "2nd", q: true, video: true },
              { show: "ADSC Open", date: "1 Jun", class: "Agility · G5", time: "33.87s", faults: 0, place: "1st", q: true, video: true },
              { show: "Thames DTC", date: "18 May", class: "Jumping · G5", time: "36.40s", faults: 5, place: null, q: false, video: false },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                style={{ background: "rgba(17,16,20,0.5)", borderLeft: `3px solid ${r.faults === 0 ? "#16A34A" : "#D97706"}` }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-semibold text-ivory truncate">{r.show}</span>
                    {r.q && (
                      <span className="text-xs px-1.5 py-0 rounded font-bold flex-shrink-0"
                        style={{ background: "rgba(22,163,74,0.2)", color: "#4ade80", fontSize: "10px" }}>Q</span>
                    )}
                    {r.video && (
                      <span className="text-stone/30 flex-shrink-0" style={{ fontSize: "10px" }}>▶</span>
                    )}
                  </div>
                  <div className="text-stone/45 leading-none" style={{ fontSize: "10px" }}>{r.class} · {r.date}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-semibold" style={{ color: r.faults === 0 ? "#4ade80" : "#FBBF24" }}>{r.time}</div>
                  <div className="text-stone/40 leading-none" style={{ fontSize: "10px" }}>
                    {r.faults === 0 ? "Clear" : `${r.faults} faults`}{r.place ? ` · ${r.place}` : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grade progress */}
          <div className="mb-4 px-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-stone/45" style={{ fontSize: "10px" }}>Grade 5 → Grade 6 progress</span>
              <span className="text-stone/45" style={{ fontSize: "10px" }}>3 of 5 Qs</span>
            </div>
            <div className="h-1 rounded-full bg-plum-700 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "60%", background: "linear-gradient(90deg, #16A34A, #4ade80)" }} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-plum-700">
            {[
              { label: "Clear Runs", value: "28" },
              { label: "Qs", value: "15" },
              { label: "Top 3s", value: "34" },
              { label: "Trials", value: "52" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-base font-bold" style={{ color: "#4ade80" }}>{s.value}</div>
                <div className="text-xs text-stone/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Result card */}
      <section className="px-5 pb-16">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-ivory mb-2">Share the win. Keep the record.</h2>
          <p className="text-stone/60 text-sm max-w-xs mx-auto">
            Log a result and generate a Result Card for Instagram, Facebook or WhatsApp in one tap.
          </p>
        </div>
        <div className="max-w-xs mx-auto">
          <p className="text-center text-xs text-stone/30 mb-3">Example card using fictional data.</p>
          <div className="rounded-2xl overflow-hidden flex flex-col"
            style={{
              aspectRatio: "4/5",
              border: "1px solid rgba(201,162,74,0.35)",
              boxShadow: "0 0 60px rgba(59,20,88,0.5), 0 8px 32px rgba(0,0,0,0.6)",
              background: "#111014",
            }}>

            {/* ── Photo zone ── */}
            <div className="relative flex-shrink-0" style={{ height: "54%" }}>
              <Image src="/dogs/luna.jpg" alt="Luna" fill className="object-cover object-top" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(17,16,20,0.5) 0%, transparent 30%, rgba(17,16,20,0.9) 85%, rgba(17,16,20,1) 100%)" }} />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <Image src="/logo.png" alt="Pawdium" width={20} height={20} className="rounded-md" />
                <span className="text-xs font-bold tracking-widest" style={{ color: "#C9A24A", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>Pawdium</span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "rgba(17,16,20,0.85)", border: "1px solid rgba(201,162,74,0.55)", color: "#E2C66D", backdropFilter: "blur(4px)" }}>
                  ShCh
                </span>
              </div>
            </div>

            {/* ── Achievement zone ── */}
            <div className="flex-1 flex flex-col items-center justify-between px-5 pt-2 pb-4 text-center">
              {/* Ribbons */}
              <div className="flex items-end justify-center gap-0.5">
                {[
                  { color: "#C9A24A" }, { color: "#7C3AED" }, { color: "#3B82F6" },
                  { color: "#C9A24A" }, { color: "#9CA3AF" },
                ].map((r, i) => <RibbonSVG key={i} color={r.color} size={32} />)}
              </div>

              {/* Name + result */}
              <div>
                <div className="text-ivory font-bold text-lg font-serif leading-tight">Luna</div>
                <div className="text-stone/45 text-xs mb-2">Silvermoor Lunar Eclipse ShCh</div>
                <div className="text-2xl font-bold gold-gradient leading-tight mb-0.5">Best of Breed</div>
                <div className="text-ivory/90 text-sm font-semibold">Crufts 2024</div>
              </div>

              {/* Meta */}
              <div>
                <div className="flex gap-1.5 justify-center flex-wrap mb-1.5">
                  <span className="text-xs px-2 py-0.5 rounded-full text-stone/55" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>NEC Birmingham</span>
                  <span className="text-xs px-2 py-0.5 rounded-full text-stone/55" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>Judge: P. Holloway</span>
                </div>
                <div className="text-xs font-semibold tracking-widest mb-1.5" style={{ color: "#C9A24A" }}>1ST · OPEN BITCH</div>
                <div className="text-xs text-stone/25 tracking-wider">pawdium.dog/luna</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 pb-16">
        <h2 className="text-xl font-bold text-ivory text-center mb-8">A profile worthy of the dog.</h2>
        <div className="grid gap-4 max-w-sm mx-auto">
          {[
            {
              icon: "🐾",
              title: "Pawdium Profile",
              desc: "A beautiful public profile for every dog — registered name, breed, titles, show history, agility stats and photos. Treat your dog like the athlete they are.",
            },
            {
              icon: "🎖️",
              title: "Achievement Rack",
              desc: "Every rosette, CC, Q, title and milestone in one visual trophy cabinet. The instant satisfaction of seeing the full career at a glance.",
            },
            {
              icon: "📸",
              title: "Result Cards",
              desc: "Log a show win or a clean agility run and generate a share-ready card for Instagram, Facebook or WhatsApp in one tap.",
            },
            {
              icon: "📋",
              title: "Show Diary & Run Log",
              desc: "Log every show or trial — date, location, judge, class, placement, time, faults and notes. One complete competition record for both worlds.",
            },
            {
              icon: "🏆",
              title: "Title Progress",
              desc: "See progress towards titles, grades and milestones without keeping it all in your head — built out further with early users.",
            },
            {
              icon: "🔒",
              title: "Privacy Controls",
              desc: "Registry numbers, health records and documents stay private until you decide otherwise. Your dog's record belongs to you.",
            },
          ].map((f) => (
            <div key={f.title} className="flex gap-4 p-4 rounded-xl bg-plum-800 border border-plum-700">
              <div className="text-2xl mt-0.5">{f.icon}</div>
              <div>
                <div className="font-semibold text-ivory text-sm mb-1">{f.title}</div>
                <div className="text-stone/60 text-sm leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mock profiles */}
      <section className="px-5 pb-16">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-ivory mb-2">Three dogs. Three stories.</h2>
          <p className="text-stone/60 text-sm">Demo profiles based on fictional data — this is what yours could look like.</p>
        </div>
        <div className="grid gap-4 max-w-sm mx-auto">
          {mockDogs.map((dog) => (
            <DogPreviewCard key={dog.slug} dog={dog} />
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="px-5 pb-16">
        <div className="max-w-sm mx-auto rounded-2xl bg-plum-800 border border-plum-700 p-6">
          <h2 className="text-lg font-bold text-ivory mb-4">
            Right now, your dog&apos;s story is everywhere and nowhere.
          </h2>
          <div className="space-y-3">
            {[
              "Show results buried in Facebook posts",
              "Agility runs logged in a spreadsheet no one else sees",
              "Ribbons in a box in the spare room",
              "Titles in a PDF no one ever finds",
              "Run videos scattered across your phone",
              "Title progress tracked in your head",
            ].map((item) => (
              <div key={item} className="flex gap-3 items-start">
                <div className="w-4 h-4 rounded-full bg-red-900/40 border border-red-700/50 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-1.5 h-0.5 bg-red-500 rounded" />
                </div>
                <span className="text-stone/60 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-plum-700">
            <p className="text-gold-400 text-sm font-medium">
              Pawdium brings the full record together: show wins, agility runs, ribbons, titles, videos and milestones. Organised, beautiful, shareable and yours.
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="px-5 pb-24 pt-4">
        <div className="max-w-sm mx-auto text-center mb-8">
          <h2 className="text-2xl font-bold text-ivory mb-3">
            Be first on the Pawdium.
          </h2>
          <p className="text-stone/60 text-sm leading-relaxed">
            Early access is limited. We&apos;re onboarding serious exhibitors and agility handlers personally — join the list and we&apos;ll be in touch.
          </p>
        </div>
        <WaitlistForm />
        <p className="text-center text-xs text-stone/30 mt-4">No spam. Your data stays yours. Unsubscribe any time.</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-plum-700 px-5 py-6 text-center">
        <div className="text-sm font-bold tracking-wide gold-gradient mb-1">Pawdium</div>
        <p className="text-stone/30 text-xs">Every result. Every ribbon. Every run.</p>
      </footer>
    </div>
  );
}
