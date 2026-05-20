import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { promises as fs } from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);
const WAITLIST_FILE = path.join(process.cwd(), "waitlist.json");

async function saveToFile(email: string, role: string) {
  let entries: { email: string; role: string; joinedAt: string }[] = [];
  try {
    const raw = await fs.readFile(WAITLIST_FILE, "utf-8");
    entries = JSON.parse(raw);
  } catch {
    // file doesn't exist yet
  }
  if (!entries.find((e) => e.email === email)) {
    entries.push({ email, role, joinedAt: new Date().toISOString() });
    await fs.writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2));
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, role } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // Always save locally — works regardless of Resend domain verification status
    await saveToFile(email, role ?? "");

    // Send confirmation email (on Resend free tier this only delivers to
    // the account owner's address until a sending domain is verified)
    try {
      await resend.emails.send({
        from: "Pawdium <hello@pawdium.dog>",
        to: email,
        subject: "You're on the Pawdium waitlist",
        html: `
          <div style="background:#05080F;color:#F5F0E8;font-family:-apple-system,sans-serif;padding:40px;max-width:520px;margin:0 auto;border-radius:12px;">
            <div style="font-size:24px;font-weight:700;letter-spacing:2px;color:#C9A84C;margin-bottom:8px;">PAWDIUM</div>
            <h1 style="font-size:22px;font-weight:600;margin:24px 0 12px;">You're on the list.</h1>
            <p style="color:#a0a8b8;line-height:1.6;margin-bottom:24px;">
              We're building the digital show record and social trophy cabinet for serious dog people.
              We'll be in touch when early access opens.
            </p>
            <p style="color:#a0a8b8;line-height:1.6;">
              In the meantime — if you'd like to help shape the product, reply to this email.
              We're talking to exhibitors and handlers right now.
            </p>
            <div style="margin-top:32px;padding-top:24px;border-top:1px solid #1A2744;color:#5a6478;font-size:13px;">
              Pawdium · The digital show record for serious dog people
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      // Email failed (e.g. unverified domain on free tier) but signup is saved
      console.warn("Email send failed:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
