import { NextRequest, NextResponse } from "next/server";
import { getDiscoveryDb } from "@/lib/discoveryDb";

export async function GET() {
  try {
    const sql = await getDiscoveryDb();
    const contacts = await sql`
      SELECT *, (activity_score + credibility_score + product_fit_score + champion_potential) AS total_score
      FROM discovery_contacts
      ORDER BY (activity_score + credibility_score + product_fit_score + champion_potential) DESC, created_at DESC
    `;
    return NextResponse.json(contacts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const d = await req.json();
    const sql = await getDiscoveryDb();

    const [contact] = await sql`
      INSERT INTO discovery_contacts (
        name, discipline, market, breeds, level, role, dog_kennel,
        why_contact, contact_route, warm_intro, status,
        outreach_sent_date, follow_up_date, interview_date,
        key_pain_points, current_workaround, reaction, willingness_to_pay,
        beta_fit, champion_potential, activity_score, credibility_score, product_fit_score,
        notes, next_action, source_url_1, source_url_2
      ) VALUES (
        ${d.name},
        ${d.discipline ?? ""},   ${d.market ?? ""},        ${d.breeds ?? ""},
        ${d.level ?? ""},        ${d.role ?? ""},           ${d.dog_kennel ?? ""},
        ${d.why_contact ?? ""},  ${d.contact_route ?? ""},  ${d.warm_intro ?? ""},
        ${d.status ?? "identified"},
        ${d.outreach_sent_date || null},
        ${d.follow_up_date || null},
        ${d.interview_date || null},
        ${d.key_pain_points ?? ""},    ${d.current_workaround ?? ""},
        ${d.reaction ?? ""},           ${d.willingness_to_pay ?? ""},
        ${d.beta_fit ?? 0},            ${d.champion_potential ?? 0},
        ${d.activity_score ?? 1},      ${d.credibility_score ?? 1},   ${d.product_fit_score ?? 1},
        ${d.notes ?? ""},       ${d.next_action ?? ""},
        ${d.source_url_1 ?? ""},       ${d.source_url_2 ?? ""}
      )
      RETURNING *, (activity_score + credibility_score + product_fit_score + champion_potential) AS total_score
    `;
    return NextResponse.json(contact, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}
