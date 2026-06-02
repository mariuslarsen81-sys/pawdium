import { NextRequest, NextResponse } from "next/server";
import { getDiscoveryDb } from "@/lib/discoveryDb";

export async function GET() {
  try {
    const sql = await getDiscoveryDb();
    const notes = await sql`
      SELECT * FROM interview_notes
      ORDER BY date DESC NULLS LAST, created_at DESC
    `;
    return NextResponse.json(notes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const d = await req.json();
    const sql = await getDiscoveryDb();
    const [note] = await sql`
      INSERT INTO interview_notes (
        contact_id, contact_name, date, discipline,
        current_workaround, biggest_pain, what_tracks_today, what_shares_today,
        reaction_pawdium, reaction_result_cards, reaction_achievement_rack, reaction_show_diary,
        verification_concerns, would_pay, price_reaction,
        must_have_features, objections, quote, follow_up_action
      ) VALUES (
        ${d.contact_id || null}, ${d.contact_name ?? ""},
        ${d.date || null}, ${d.discipline ?? ""},
        ${d.current_workaround ?? ""}, ${d.biggest_pain ?? ""},
        ${d.what_tracks_today ?? ""}, ${d.what_shares_today ?? ""},
        ${d.reaction_pawdium ?? ""}, ${d.reaction_result_cards ?? ""},
        ${d.reaction_achievement_rack ?? ""}, ${d.reaction_show_diary ?? ""},
        ${d.verification_concerns ?? ""}, ${d.would_pay ?? ""},
        ${d.price_reaction ?? ""}, ${d.must_have_features ?? ""},
        ${d.objections ?? ""}, ${d.quote ?? ""}, ${d.follow_up_action ?? ""}
      )
      RETURNING *
    `;
    return NextResponse.json(note, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
