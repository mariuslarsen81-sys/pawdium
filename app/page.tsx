"use client";

import { useState } from "react";
import Link from "next/link";
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
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      if (res.ok) {
        setState("success");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="text-center py-8">
        <div className="text-3xl mb-3">🎖️</div>
        <h3 className="text-xl font-semibold text-gold-400 mb-2">You&apos;re on the list.</h3>
        <p className="text-slate-400 text-sm">We&apos;ll be in touch when early access opens. Check your inbox.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3.5 rounded-lg bg-navy-700 border border-navy-600 text-cream placeholder-slate-500 focus:outline-none focus:border-gold-500 text-base"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full px-4 py-3.5 rounded-lg bg-navy-700 border border-navy-600 text-cream focus:outline-none focus:border-gold-500 text-base"
      >
        <option value="">I am a… (optional)</option>
        <option value="exhibitor">Show Exhibitor</option>
        <option value="breeder">Breeder</option>
        <option value="handler">Professional Handler</option>
        <option value="owner-handler">Owner-Handler</option>
        <option value="enthusiast">Dog Sport Enthusiast</option>
        <option value="other">Other</option>
      </select>
      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full py-3.5 rounded-lg font-semibold text-navy-950 text-base transition-all disabled:opacity-70"
        style={{ background: "linear-gradient(135deg, #F0D080 0%, #C9A84C 50%, #A8893A 100%)" }}
      >
        {state === "loading" ? "Joining…" : "Join the Waitlist"}
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
      <div className="rounded-2xl border border-navy-700 bg-navy-800 overflow-hidden card-glow transition-all duration-300 group-hover:border-gold-600 group-hover:scale-[1.02]">
        <div className={`h-24 bg-gradient-to-br ${dog.coverGradient} relative flex items-end px-5 pb-3`}>
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: `radial-gradient(circle at 30% 50%, ${dog.accentColor}, transparent 70%)` }}
          />
          <div className="relative">
            <div className="text-2xl font-bold text-cream">{dog.callName}</div>
            <div className="text-xs" style={{ color: dog.accentColor }}>{dog.breed}</div>
          </div>
          {dog.titles.length > 0 && (
            <div className="absolute top-3 right-3 flex gap-1">
              {dog.titles.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-600/30 font-medium">
                  {t === "Show Champion" ? "ShCh" : t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="p-5">
          <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{dog.bio}</p>
          <div className="flex gap-4 mb-4">
            {[
              { label: "CCs", value: dog.stats.ccs },
              { label: "RCCs", value: dog.stats.rccs },
              { label: "BOBs", value: dog.stats.bobs },
              { label: "Shows", value: dog.stats.shows },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-lg font-bold text-gold-400">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-1 flex-wrap">
            {dog.ribbons.slice(0, 6).map((r, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: r.color, backgroundColor: `${r.color}22` }}
                title={r.label}
              />
            ))}
            {dog.ribbons.length > 6 && (
              <div className="w-7 h-7 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center text-xs text-slate-400">
                +{dog.ribbons.length - 6}
              </div>
            )}
          </div>
        </div>
        <div className="px-5 pb-4">
          <span className="text-xs text-gold-500 group-hover:text-gold-400 transition-colors font-medium">
            View full profile →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-navy-950">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 h-14 border-b border-navy-800 bg-navy-950/90 backdrop-blur-md">
        <span className="text-lg font-bold tracking-widest gold-gradient">PAWDIUM</span>
        <a
          href="#waitlist"
          className="text-sm font-semibold px-4 py-1.5 rounded-lg border border-gold-600/50 text-gold-400 hover:bg-gold-500/10 transition-colors"
        >
          Join Waitlist
        </a>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, #C9A84C, transparent 70%)" }}
          />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-600/30 text-gold-400 text-xs font-medium mb-6 tracking-wide">
            NOW TAKING EARLY ACCESS
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5 text-balance">
            Your dog&apos;s wins deserve{" "}
            <span className="gold-gradient">a proper home.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md mx-auto text-balance">
            Log your results. Build your ribbon rack. Share beautiful win cards.
            The digital show record for serious dog people.
          </p>
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {["Show Exhibitors", "Breeders", "Owner-Handlers", "Kennel Owners"].map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Ribbon rack preview */}
      <section className="px-5 pb-16">
        <div className="max-w-sm mx-auto rounded-2xl border border-navy-700 bg-navy-800 p-6 card-glow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-cream">Luna&apos;s Ribbon Rack</div>
              <div className="text-xs text-slate-500">Show Champion · Border Collie</div>
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
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-navy-700">
            {[
              { label: "CCs", value: "7" },
              { label: "RCCs", value: "4" },
              { label: "BOBs", value: "12" },
              { label: "Shows", value: "34" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-base font-bold text-gold-400">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Result card preview */}
      <section className="px-5 pb-16">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-cream mb-2">One tap. Share-ready.</h2>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            Log a result and instantly generate a card for Instagram, Facebook or WhatsApp.
          </p>
        </div>
        <div className="max-w-xs mx-auto">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0D1526 0%, #05080F 60%, #131E35 100%)",
              border: "1px solid rgba(201,168,76,0.3)",
              boxShadow: "0 0 40px rgba(201,168,76,0.12)",
            }}
          >
            <div className="px-6 pt-6 pb-4 text-center">
              <div className="text-xs tracking-widest text-gold-600 font-medium mb-1">PAWDIUM</div>
              <div
                className="w-8 h-0.5 mx-auto mb-4"
                style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }}
              />
              <div className="text-2xl font-bold text-cream mb-0.5">Luna</div>
              <div className="text-xs text-slate-400 mb-4">Silvermoor Lunar Eclipse ShCh</div>
              <div className="text-3xl font-bold gold-gradient mb-1">Best of Breed</div>
              <div className="text-sm text-slate-300 font-medium mb-4">Crufts 2024</div>
              <div className="flex gap-2 justify-center flex-wrap mb-4">
                <span className="text-xs px-2.5 py-1 rounded-full bg-navy-700 text-slate-300">NEC Birmingham</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-navy-700 text-slate-300">Judge: P. Holloway</span>
              </div>
              <div className="text-xs text-gold-600 tracking-wide">1ST · OPEN BITCH</div>
            </div>
            <div className="bg-navy-800/50 px-6 py-3 flex items-center justify-between">
              <div className="flex gap-1">
                {["#DC2626", "#C9A84C", "#9333EA"].map((c) => (
                  <div key={c} className="w-4 h-4 rounded-full border border-navy-600" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="text-xs text-slate-500 tracking-wider">pawdium.com/luna</div>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-3">Tap to share to Stories, Feed or WhatsApp</p>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 pb-16">
        <h2 className="text-xl font-bold text-cream text-center mb-8">Everything in one place.</h2>
        <div className="grid gap-4 max-w-sm mx-auto">
          {[
            {
              icon: "🐾",
              title: "Dog Profiles",
              desc: "A beautiful public profile for every dog — call name, registered name, breed, titles, show history and photos.",
            },
            {
              icon: "🎖️",
              title: "Visual Ribbon Rack",
              desc: "A gorgeous trophy cabinet showing every ribbon, rosette, CC and title. The instant hit of seeing it all together.",
            },
            {
              icon: "📸",
              title: "Shareable Win Cards",
              desc: "After every result, generate a polished card for Instagram, Facebook or WhatsApp. Free, fast and on-brand.",
            },
            {
              icon: "📊",
              title: "Show Diary",
              desc: "Log every show: date, location, judge, class, placement and notes. Your complete competition history in one place.",
            },
            {
              icon: "🏆",
              title: "Breed Leaderboards",
              desc: "See the top dogs in your breed, recent results, upcoming shows and leading kennels.",
            },
            {
              icon: "🔒",
              title: "Privacy Controls",
              desc: "Choose what's public. Registry numbers, health records and documents stay private until you decide otherwise.",
            },
          ].map((f) => (
            <div key={f.title} className="flex gap-4 p-4 rounded-xl bg-navy-800 border border-navy-700">
              <div className="text-2xl mt-0.5">{f.icon}</div>
              <div>
                <div className="font-semibold text-cream text-sm mb-1">{f.title}</div>
                <div className="text-slate-400 text-sm leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mock profiles */}
      <section className="px-5 pb-16">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-cream mb-2">Meet the dogs.</h2>
          <p className="text-slate-400 text-sm">Three example profiles — this is what yours could look like.</p>
        </div>
        <div className="grid gap-4 max-w-sm mx-auto">
          {mockDogs.map((dog) => (
            <DogPreviewCard key={dog.slug} dog={dog} />
          ))}
        </div>
      </section>

      {/* The gap */}
      <section className="px-5 pb-16">
        <div className="max-w-sm mx-auto rounded-2xl bg-navy-800 border border-navy-700 p-6">
          <h2 className="text-lg font-bold text-cream mb-4">
            Today, your wins live everywhere and nowhere.
          </h2>
          <div className="space-y-3">
            {[
              "Results in a Facebook post that disappears into the feed",
              "Ribbons in a box in the spare room",
              "Titles in a PDF no one ever sees",
              "Progress scattered across spreadsheets",
              "Show photos buried in your camera roll",
              "A pedigree that only you understand",
            ].map((item) => (
              <div key={item} className="flex gap-3 items-start">
                <div className="w-4 h-4 rounded-full bg-red-900/40 border border-red-700/50 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-1.5 h-0.5 bg-red-500 rounded" />
                </div>
                <span className="text-slate-400 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-navy-700">
            <p className="text-gold-400 text-sm font-medium">
              Pawdium puts it all in one place — organised, beautiful, shareable and yours.
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="px-5 pb-24 pt-4">
        <div className="max-w-sm mx-auto text-center mb-8">
          <h2 className="text-2xl font-bold text-cream mb-3">Be first through the gate.</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Early access is limited. Join the waitlist and we&apos;ll reach out personally — we&apos;re talking
            to serious exhibitors right now.
          </p>
        </div>
        <WaitlistForm />
        <p className="text-center text-xs text-slate-600 mt-4">No spam. No selling your data. Unsubscribe any time.</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-800 px-5 py-6 text-center">
        <div className="text-sm font-bold tracking-widest gold-gradient mb-1">PAWDIUM</div>
        <p className="text-slate-600 text-xs">The digital show record for serious dog people.</p>
      </footer>
    </div>
  );
}
