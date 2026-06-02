import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const db = () => neon(process.env.POSTGRES_URL!);

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [t] = await db()`SELECT * FROM outreach_templates WHERE id = ${parseInt(params.id)}`;
    if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(t);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const d = await req.json();
    const [t] = await db()`
      UPDATE outreach_templates
      SET type = ${d.type ?? ""}, label = ${d.label ?? ""}, subject = ${d.subject ?? ""}, body = ${d.body ?? ""}, updated_at = NOW()
      WHERE id = ${parseInt(params.id)}
      RETURNING *
    `;
    return NextResponse.json(t);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db()`DELETE FROM outreach_templates WHERE id = ${parseInt(params.id)}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
