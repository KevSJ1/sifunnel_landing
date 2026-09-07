import { NextResponse } from "next/server";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_TURNSTILE_ENABLED === "false") {
    return NextResponse.json({ ok: true, disabled: true });
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Turnstile is not configured" }, { status: 503 });

  let body: { token?: unknown; action?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof body.token !== "string" || !body.token ||
      (body.action !== "login" && body.action !== "signup")) {
    return NextResponse.json({ error: "Invalid challenge" }, { status: 400 });
  }

  const form = new FormData();
  form.set("secret", secret);
  form.set("response", body.token);
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (clientIp) form.set("remoteip", clientIp);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: form, cache: "no-store" });
    const result = (await response.json()) as { success?: boolean; action?: string };
    if (!response.ok || result.success !== true || result.action !== body.action) {
      return NextResponse.json({ error: "Security challenge failed" }, { status: 403 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Security challenge unavailable" }, { status: 503 });
  }
}