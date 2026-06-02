import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const db = () => neon(process.env.POSTGRES_URL!);

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [note] = await db()`SELECT * FROM interview_notes WHERE id = ${parseInt(params.id)}`;
    if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(note);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const d = await req.json();
    const [note] = await db()`
      UPDATE interview_notes SET
        contact_id               = ${d.contact_id || null},
        contact_name             = ${d.contact_name ?? ""},
        date                     = ${d.date || null},
        discipline               = ${d.discipline ?? ""},
        current_workaround       = ${d.current_workaround ?? ""},
        biggest_pain             = ${d.biggest_pain ?? ""},
        what_tracks_today        = ${d.what_tracks_today ?? ""},
        what_shares_today        = ${d.what_shares_today ?? ""},
        reaction_pawdium         = ${d.reaction_pawdium ?? ""},
        reaction_result_cards    = ${d.reaction_result_cards ?? ""},
        reaction_achievement_rack = ${d.reaction_achievement_rack ?? ""},
        reaction_show_diary      = ${d.reaction_show_diary ?? ""},
        verification_concerns    = ${d.verification_concerns ?? ""},
        would_pay                = ${d.would_pay ?? ""},
        price_reaction           = ${d.price_reaction ?? ""},
        must_have_features       = ${d.must_have_features ?? ""},
        objections               = ${d.objections ?? ""},
        quote                    = ${d.quote ?? ""},
        follow_up_action         = ${d.follow_up_action ?? ""},
        updated_at               = NOW()
      WHERE id = ${parseInt(params.id)}
      RETURNING *
    `;
    return NextResponse.json(note);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db()`DELETE FROM interview_notes WHERE id = ${parseInt(params.id)}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
