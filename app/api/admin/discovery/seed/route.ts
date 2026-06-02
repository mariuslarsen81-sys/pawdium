import { NextResponse } from "next/server";
import { getDiscoveryDb } from "@/lib/discoveryDb";

const SEED = [
  { name: "Lee Cox / Vanitonia",    discipline: "show",    market: "UK",     breeds: "Bruin / Sh Ch Vanitonia Soloist",           level: "elite",   role: "breeder-owner-handler",  dog_kennel: "Vanitonia",    why_contact: "Show credibility perception test",            activity_score: 5, credibility_score: 5, product_fit_score: 3 },
  { name: "Shannon Springford",     discipline: "agility", market: "UK",     breeds: "Halloumi, Banter",                          level: "elite",   role: "agility-handler",        dog_kennel: "",             why_contact: "Achievement profile utility for agility",      activity_score: 5, credibility_score: 5, product_fit_score: 5 },
  { name: "Cynthia Hornor",         discipline: "agility", market: "US",     breeds: "Nimble / CH Dog Agility",                   level: "elite",   role: "agility-handler",        dog_kennel: "",             why_contact: "Cross-breed achievement profiles",             activity_score: 5, credibility_score: 5, product_fit_score: 3 },
  { name: "Dalton Meredith",        discipline: "agility", market: "UK",     breeds: "Fandabidozi Border Collies",                level: "elite",   role: "agility-handler",        dog_kennel: "Fandabidozi",  why_contact: "Multi-dog history tracking value",             activity_score: 5, credibility_score: 3, product_fit_score: 5 },
  { name: "Melanie Raymond",        discipline: "show",    market: "UK",     breeds: "Viking / Australian Shepherd",              level: "elite",   role: "exhibitor",              dog_kennel: "",             why_contact: "Show vs. performance profile separation",      activity_score: 5, credibility_score: 5, product_fit_score: 3 },
  { name: "Giovanni Liguori",       discipline: "show",    market: "Europe", breeds: "Miuccia / Whippet",                         level: "elite",   role: "professional-handler",   dog_kennel: "",             why_contact: "Global English-language appeal",               activity_score: 5, credibility_score: 5, product_fit_score: 3 },
  { name: "Jen Slade",              discipline: "agility", market: "UK",     breeds: "Ag Ch Dare To Dream It Must Be Fate",       level: "elite",   role: "agility-handler",        dog_kennel: "",             why_contact: "Agility record-keeping adoption",              activity_score: 5, credibility_score: 5, product_fit_score: 5 },
  { name: "Katie Bernardin",        discipline: "show",    market: "US",     breeds: "Monty / Giant Schnauzer",                   level: "elite",   role: "owner-handler",          dog_kennel: "",             why_contact: "Public dog CV credibility",                    activity_score: 3, credibility_score: 3, product_fit_score: 3 },
  { name: "Dylan Osbourne",         discipline: "agility", market: "UK",     breeds: "Jelly",                                     level: "serious", role: "agility-handler",        dog_kennel: "",             why_contact: "Youth sharing behavior",                       activity_score: 3, credibility_score: 3, product_fit_score: 5 },
  { name: "Chris Kerton",           discipline: "agility", market: "UK",     breeds: "Poughkeepsie The Funky Duck",               level: "serious", role: "agility-handler",        dog_kennel: "",             why_contact: "Performance archive vs. title trackers",       activity_score: 3, credibility_score: 5, product_fit_score: 5 },
];

export async function POST() {
  try {
    const sql = await getDiscoveryDb();

    const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM discovery_contacts`;
    if (count > 0) {
      return NextResponse.json({ message: "Already seeded", count });
    }

    for (const c of SEED) {
      await sql`
        INSERT INTO discovery_contacts
          (name, discipline, market, breeds, level, role, dog_kennel, why_contact, activity_score, credibility_score, product_fit_score, status)
        VALUES
          (${c.name}, ${c.discipline}, ${c.market}, ${c.breeds}, ${c.level}, ${c.role}, ${c.dog_kennel}, ${c.why_contact}, ${c.activity_score}, ${c.credibility_score}, ${c.product_fit_score}, 'identified')
      `;
    }

    return NextResponse.json({ success: true, inserted: SEED.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
