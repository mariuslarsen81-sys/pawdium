import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

function db() {
  return neon(process.env.POSTGRES_URL!);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = db();
    const [contact] = await sql`
      SELECT *, (activity_score + credibility_score + product_fit_score + champion_potential) AS total_score
      FROM discovery_contacts
      WHERE id = ${parseInt(params.id)}
    `;
    if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(contact);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const d = await req.json();
    const sql = db();
    const [contact] = await sql`
      UPDATE discovery_contacts SET
        name               = ${d.name},
        discipline         = ${d.discipline ?? ""},
        market             = ${d.market ?? ""},
        breeds             = ${d.breeds ?? ""},
        level              = ${d.level ?? ""},
        role               = ${d.role ?? ""},
        dog_kennel         = ${d.dog_kennel ?? ""},
        why_contact        = ${d.why_contact ?? ""},
        contact_route      = ${d.contact_route ?? ""},
        warm_intro         = ${d.warm_intro ?? ""},
        status             = ${d.status ?? "identified"},
        outreach_sent_date = ${d.outreach_sent_date || null},
        follow_up_date     = ${d.follow_up_date || null},
        interview_date     = ${d.interview_date || null},
        call_outcome       = ${d.call_outcome ?? ""},
        email              = ${d.email ?? ""},
        phone              = ${d.phone ?? ""},
        key_pain_points    = ${d.key_pain_points ?? ""},
        current_workaround = ${d.current_workaround ?? ""},
        reaction           = ${d.reaction ?? ""},
        willingness_to_pay = ${d.willingness_to_pay ?? ""},
        beta_fit           = ${d.beta_fit ?? 0},
        champion_potential = ${d.champion_potential ?? 0},
        activity_score     = ${d.activity_score ?? 1},
        credibility_score  = ${d.credibility_score ?? 1},
        product_fit_score  = ${d.product_fit_score ?? 1},
        notes              = ${d.notes ?? ""},
        next_action        = ${d.next_action ?? ""},
        source_url_1       = ${d.source_url_1 ?? ""},
        source_url_2       = ${d.source_url_2 ?? ""},
        updated_at         = NOW()
      WHERE id = ${parseInt(params.id)}
      RETURNING *, (activity_score + credibility_score + product_fit_score + champion_potential) AS total_score
    `;
    return NextResponse.json(contact);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = db();
    await sql`DELETE FROM discovery_contacts WHERE id = ${parseInt(params.id)}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
