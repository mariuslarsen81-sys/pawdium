import { NextRequest, NextResponse } from "next/server";
import { getDiscoveryDb } from "@/lib/discoveryDb";

const SEED_TEMPLATES = [
  {
    type: "show-exhibitor", label: "Show Exhibitor",
    subject: "Pawdium — a digital profile for [Dog]'s career",
    body: `Hi [Name],

I've been following [Dog]'s results — [recent achievement] is genuinely impressive. Congratulations.

I'm building Pawdium — a digital achievement profile for competitive dogs. The idea is simple: one place for every result, ribbon, CC, title and milestone. A record that actually does justice to the dog's career, and is easy to share with judges, breeders and the wider community.

I'm talking to serious exhibitors right now to make sure I'm building the right thing. Would you be open to a 20-minute call? I'd love to hear how you currently track [Dog]'s results and what would actually be useful.

No sales pitch — I'm at the research stage and your perspective would directly shape what gets built.

Best,
Marius
Pawdium — pawdium.dog`,
  },
  {
    type: "agility-handler", label: "Agility Handler",
    subject: "Pawdium — a run log and achievement profile for agility dogs",
    body: `Hi [Name],

I've been watching [Dog]'s progress — [Grade/recent achievement] is brilliant.

I'm building Pawdium — a digital achievement profile and run log for competitive dogs. Every clear round, Q, grade progression and title in one place. The kind of record that does justice to the work that goes into a dog's career.

I'm speaking to agility handlers right now to make sure I'm building something that actually fits how you work. Would you have 20 minutes for a call? I'd love to hear how you currently track [Dog]'s results.

No pitch — purely research. Your input would directly shape what gets built.

Best,
Marius
Pawdium — pawdium.dog`,
  },
  {
    type: "breeder-owner-handler", label: "Breeder-Owner-Handler",
    subject: "Pawdium — digital records for your dogs' careers",
    body: `Hi [Name],

I've admired [Kennel]'s results — the consistency across generations is something else.

I'm building Pawdium — a digital achievement profile for competitive dogs. Show results, titles, ribbons, health records and milestones in one place. For a kennel like yours, it could also become a living record across a breeding programme — linking sire/dam performance to progeny.

I'm at the research stage and I'm speaking to serious breeder-owner-handlers to make sure I'm building the right thing. Would you have 20 minutes to talk?

Best,
Marius
Pawdium — pawdium.dog`,
  },
  {
    type: "photographer", label: "Photographer",
    subject: "Pawdium — a platform you might want to know about",
    body: `Hi [Name],

I've seen your work — the ring-side shots especially are excellent.

I'm building Pawdium, a digital achievement profile for competitive dogs. We're in early stages and thinking about how show photography fits into the product — potentially a way for handlers to attach your photos directly to results and share them.

Would you be open to a short call? I'd love to understand how you currently work with handlers and whether something like Pawdium would be relevant to you.

Best,
Marius
Pawdium — pawdium.dog`,
  },
  {
    type: "organiser", label: "Organiser / Club",
    subject: "Pawdium — worth a conversation?",
    body: `Hi [Name],

I'm building Pawdium — a digital achievement profile for competitive dogs. Show results, ribbons, titles and run logs in one place.

As you're involved in [Club/show organisation], I'd love to understand how you currently handle result records and whether a platform like this could be useful to members or integrated into future events.

Would you have 20 minutes for a call?

Best,
Marius
Pawdium — pawdium.dog`,
  },
  {
    type: "follow-up", label: "Follow-up",
    subject: "Following up — Pawdium",
    body: `Hi [Name],

Just following up on my message from [date]. Completely understand if timing isn't right.

If you have 20 minutes at any point to talk about how you track [Dog]'s results, I'd genuinely value the conversation.

Either way, you can see a demo profile at pawdium.dog — Luna's profile gives an idea of the direction.

Best,
Marius`,
  },
];

export async function GET() {
  try {
    const sql = await getDiscoveryDb();
    const templates = await sql`SELECT * FROM outreach_templates ORDER BY type, created_at`;
    return NextResponse.json(templates);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const d = await req.json();
    const sql = await getDiscoveryDb();

    // Seed if requested and table is empty
    if (d.seed) {
      const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM outreach_templates`;
      if (count === 0) {
        for (const t of SEED_TEMPLATES) {
          await sql`
            INSERT INTO outreach_templates (type, label, subject, body)
            VALUES (${t.type}, ${t.label}, ${t.subject}, ${t.body})
          `;
        }
        return NextResponse.json({ seeded: true, count: SEED_TEMPLATES.length });
      }
      return NextResponse.json({ seeded: false, message: "Already has templates" });
    }

    const [template] = await sql`
      INSERT INTO outreach_templates (type, label, subject, body)
      VALUES (${d.type ?? ""}, ${d.label ?? ""}, ${d.subject ?? ""}, ${d.body ?? ""})
      RETURNING *
    `;
    return NextResponse.json(template, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
