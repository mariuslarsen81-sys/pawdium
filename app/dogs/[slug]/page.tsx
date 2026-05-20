import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getDogBySlug, mockDogs } from "@/lib/mockDogs";

export function generateStaticParams() {
  return mockDogs.map((d) => ({ slug: d.slug }));
}

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

export default function DogProfilePage({ params }: { params: { slug: string } }) {
  const dog = getDogBySlug(params.slug);
  if (!dog) notFound();

  return (
    <div className="min-h-screen bg-plum-900">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 h-14 border-b border-plum-700 bg-plum-900/90 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Pawdium" width={28} height={28} className="rounded-lg" />
          <span className="text-lg font-bold tracking-wide gold-gradient">Pawdium</span>
        </Link>
        <Link href="/#waitlist"
          className="text-sm font-semibold px-4 py-1.5 rounded-lg border border-gold-600/50 text-gold-400 hover:bg-gold-500/10 transition-colors">
          Join Waitlist
        </Link>
      </nav>

      {/* Cover */}
      <div className="pt-14 h-80 relative overflow-hidden">
        <Image
          src={dog.coverImage}
          alt={`${dog.callName} cover`}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(17,16,20,0.1), rgba(17,16,20,0.75))" }} />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-plum-900 to-transparent" />
      </div>

      {/* Profile header */}
      <div className="px-5 pb-6 -mt-16 relative">
        <div className="flex items-end justify-between mb-4">
          <div className="w-32 h-32 rounded-2xl border-4 border-plum-900 overflow-hidden relative shadow-xl">
            <Image
              src={dog.profileImage}
              alt={dog.callName}
              fill
              className="object-cover object-top"
            />
          </div>
          <div className="flex flex-col gap-1 items-end">
            {dog.titles.map((t) => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-600/30 font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-ivory font-serif mb-0.5">{dog.callName}</h1>
        <div className="text-sm text-stone/60 mb-1">{dog.registeredName}</div>
        <div className="text-sm text-stone/50 mb-4">{dog.breed} · {dog.sex} · {dog.color}</div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="bg-plum-800 rounded-xl p-3 border border-plum-700">
            <div className="text-stone/40 text-xs mb-0.5">Date of Birth</div>
            <div className="text-ivory text-sm">{dog.dob}</div>
          </div>
          <div className="bg-plum-800 rounded-xl p-3 border border-plum-700">
            <div className="text-stone/40 text-xs mb-0.5">Handler</div>
            <div className="text-ivory text-sm">{dog.handler}</div>
          </div>
        </div>

        <p className="text-stone/60 text-sm leading-relaxed">{dog.bio}</p>
      </div>

      {/* Stats */}
      <div className="px-5 pb-6">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "CCs", value: dog.stats.ccs },
            { label: "RCCs", value: dog.stats.rccs },
            { label: "BOBs", value: dog.stats.bobs },
            { label: "Shows", value: dog.stats.shows },
          ].map((s) => (
            <div key={s.label} className="bg-plum-800 border border-plum-700 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-gold-400">{s.value}</div>
              <div className="text-xs text-stone/40">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ribbon rack */}
      <div className="px-5 pb-6">
        <h2 className="text-base font-semibold text-ivory mb-4">Ribbon Rack</h2>
        <div className="bg-plum-800 border border-plum-700 rounded-2xl p-5 card-glow">
          <div className="grid grid-cols-6 gap-3">
            {dog.ribbons.map((r, i) => (
              <div key={i} className="flex flex-col items-center gap-1" title={r.label}>
                <RibbonSVG color={r.color} size={40} />
                <span className="text-center leading-tight" style={{ fontSize: "7px", color: r.color, opacity: 0.9 }}>
                  {r.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 pb-6">
        <div className="bg-plum-800 border border-plum-700 rounded-xl p-4">
          <div className="text-xs text-stone/40 font-medium mb-3 uppercase tracking-wide">Key</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { color: "#C9A24A", label: "Challenge Certificate (CC)" },
              { color: "#9CA3AF", label: "Reserve CC" },
              { color: "#7C3AED", label: "Best of Breed (BOB)" },
              { color: "#3B82F6", label: "Group Placement" },
              { color: "#DC2626", label: "Class Win (1st)" },
              { color: "#16A34A", label: "Junior Warrant / BPB" },
              { color: "#EF4444", label: "Best in Show" },
            ].map((k) => (
              <div key={k.label} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: k.color, opacity: 0.7 }} />
                <span className="text-xs text-stone/50">{k.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Show Diary */}
      <div className="px-5 pb-6">
        <h2 className="text-base font-semibold text-ivory mb-4">Show Diary</h2>
        <div className="space-y-3">
          {dog.results.map((r, i) => (
            <div key={i} className="bg-plum-800 border border-plum-700 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="font-semibold text-ivory text-sm">{r.show}</div>
                  <div className="text-xs text-stone/40">{r.date} · {r.location}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0"
                  style={{
                    backgroundColor: r.placement === "1st" ? "#DC262622" : "#9333EA22",
                    color: r.placement === "1st" ? "#DC2626" : "#9333EA",
                    border: `1px solid ${r.placement === "1st" ? "#DC262644" : "#9333EA44"}`,
                  }}>
                  {r.placement}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-plum-700 text-stone/50">{r.class}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-plum-700 text-stone/50">Judge: {r.judge}</span>
                {r.award && (
                  <span className="text-xs px-2 py-0.5 rounded bg-gold-500/10 text-gold-500 border border-gold-600/20">{r.award}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share */}
      <div className="px-5 pb-10">
        <div className="bg-plum-800 border border-gold-600/20 rounded-2xl p-5">
          <div className="text-sm font-semibold text-ivory mb-1">Share {dog.callName}&apos;s Pawdium Profile</div>
          <div className="text-xs text-stone/40 mb-3">pawdium.dog/dogs/{dog.slug}</div>
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-plum-900"
              style={{ background: "linear-gradient(135deg, #EDD98A 0%, #C9A24A 100%)" }}>
              Copy Link
            </button>
            <button className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-plum-700 border border-plum-600 text-ivory">
              Share Result Card
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-16">
        <div className="rounded-2xl p-6 text-center border border-plum-600"
          style={{ background: "linear-gradient(135deg, #22102F, #111014)" }}>
          <div className="text-sm text-gold-400 font-medium mb-2">Demo profile — fictional data.</div>
          <p className="text-stone/60 text-sm mb-5">
            Join the waitlist to build your own dog&apos;s profile.
          </p>
          <Link href="/#waitlist"
            className="inline-block px-6 py-3 rounded-xl font-semibold text-plum-900 text-sm"
            style={{ background: "linear-gradient(135deg, #EDD98A 0%, #C9A24A 100%)" }}>
            Build your dog&apos;s Pawdium
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-plum-700 px-5 py-6 text-center">
        <Link href="/" className="text-sm font-bold tracking-wide gold-gradient">Pawdium</Link>
        <p className="text-stone/30 text-xs mt-1">Every result. Every ribbon. Every run.</p>
      </footer>
    </div>
  );
}
