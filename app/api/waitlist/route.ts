import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { neon } from "@neondatabase/serverless";

const resend = new Resend(process.env.RESEND_API_KEY);

async function getDb() {
  const sql = neon(process.env.POSTGRES_URL!);
  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      role TEXT,
      joined_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  return sql;
}

export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const sql = await getDb();

    await sql`
      INSERT INTO waitlist (email, role)
      VALUES (${email}, ${role ?? ""})
      ON CONFLICT (email) DO NOTHING
    `;

    try {
      await resend.emails.send({
        from: "Marius at Pawdium <hello@pawdium.dog>",
        to: email,
        subject: "You're on the Pawdium list",
        html: `
          <div style="background:#111014;color:#F7F2E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:48px 40px;max-width:520px;margin:0 auto;border-radius:16px;border:1px solid #22102F;">
            <div style="font-size:13px;font-weight:700;letter-spacing:3px;background:linear-gradient(135deg,#EDD98A,#C9A24A);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:32px;">PAWDIUM</div>
            <h1 style="font-size:26px;font-weight:700;margin:0 0 16px;color:#F7F2E8;line-height:1.3;">You're on the list.</h1>
            <p style="color:#D8D0C3;line-height:1.7;margin:0 0 20px;font-size:15px;">
              Every result. Every ribbon. Every run — in one place, beautifully presented.
              Whether you're chasing a Championship title or your next clear round, Pawdium is built for dogs like yours.
            </p>
            <p style="color:#D8D0C3;line-height:1.7;margin:0 0 32px;font-size:15px;">
              Early access is limited and we're bringing people on personally. We'll be in touch soon.
            </p>
            <p style="color:#D8D0C3;line-height:1.7;margin:0 0 8px;font-size:15px;">
              In the meantime, if you want to help shape what we build — reply to this email. I'm talking to exhibitors and handlers right now and I'd love to hear about your dog.
            </p>
            <p style="color:#F7F2E8;line-height:1.7;margin:32px 0 0;font-size:15px;">
              Marius<br>
              <span style="color:#C9A24A;">Founder, Pawdium</span>
            </p>
            <div style="margin-top:40px;padding-top:24px;border-top:1px solid #22102F;color:#6B6460;font-size:12px;letter-spacing:0.5px;">
              Pawdium &middot; Every result. Every ribbon. Every run.
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.warn("Email send failed:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
