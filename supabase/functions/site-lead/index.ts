import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// Επιτρεπόμενες διευθύνσεις του σάιτ
const ALLOWED = [
  "https://christoskoltsis.gr",
  "https://www.christoskoltsis.gr",
  "https://koltsis2002-hash.github.io",
];
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ALLOWED.includes(origin) ? origin : ALLOWED[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Vary": "Origin",
});
const json = (o: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(o), { status, headers: { ...cors(origin), "Content-Type": "application/json" } });
const clip = (v: unknown, n: number) => String(v ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function sha(s: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (req.method !== "POST") return json({ ok: false }, 405, origin);
  if (!origin || !ALLOWED.includes(origin)) return json({ ok: false, error: "origin" }, 403, origin);

  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ ok: false, error: "bad_json" }, 400, origin); }

  // Προστασία από spam: κρυφό πεδίο και ελάχιστος χρόνος συμπλήρωσης
  if (clip(b.website, 200)) return json({ ok: true }, 200, origin);
  const elapsed = Number(b.elapsed_ms ?? 0);
  if (!(elapsed >= 3000)) return json({ ok: false, error: "too_fast" }, 400, origin);

  const lead = {
    name: clip(b.name, 120),
    phone: clip(b.phone, 30),
    email: clip(b.email, 160),
    topic: clip(b.topic, 80),
    meet: clip(b.meet, 40),
    pref_day: clip(b.pref_day, 20),
    pref_slot: clip(b.pref_slot, 30),
    message: clip(b.message, 1500),
    consent: b.consent === true,
    source: clip(b.source, 40) || "site",
  };
  // Το ερωτηματολόγιο ζητά υποχρεωτικά email· το τηλέφωνο είναι προαιρετικό
  const quiz = lead.source === "erotimatologio";
  const digits = lead.phone.replace(/\D/g, "");
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email);
  const phoneOk = quiz ? digits.length === 0 || digits.length >= 10 : digits.length >= 10;
  if (lead.name.length < 2 || !phoneOk || !lead.consent || (quiz && !emailOk)) return json({ ok: false, error: "invalid" }, 422, origin);
  if (lead.email && !emailOk) return json({ ok: false, error: "invalid_email" }, 422, origin);
  const raw = quiz && b.answers && typeof b.answers === "object" ? JSON.stringify(b.answers) : "";
  const answers = raw && raw.length <= 4000 ? JSON.parse(raw) : null;

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  const ip_hash = ip ? await sha(ip + "|koltsis") : null;

  // Όριο: έως 5 αιτήματα ανά 10 λεπτά από την ίδια σύνδεση
  if (ip_hash) {
    const since = new Date(Date.now() - 10 * 60e3).toISOString();
    const { count } = await sb.from("site_leads").select("id", { count: "exact", head: true }).eq("ip_hash", ip_hash).gte("created_at", since);
    if ((count ?? 0) >= 5) return json({ ok: false, error: "rate" }, 429, origin);
  }

  const { data, error } = await sb.from("site_leads").insert({ ...lead, answers, ip_hash }).select("id").single();
  if (error) return json({ ok: false, error: "db" }, 500, origin);

  // Ειδοποίηση στο Telegram
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN"), chat = Deno.env.get("TELEGRAM_CHAT_ID");
  let tg = false;
  if (token && chat) {
    const lines = [
      quiz ? "🟠 <b>Νέο ερωτηματολόγιο από το σάιτ</b>" : "🟠 <b>Νέο αίτημα από το σάιτ</b>",
      `👤 ${esc(lead.name)}`,
      lead.phone && `📞 ${esc(lead.phone)}`,
      lead.email && `✉️ ${esc(lead.email)}`,
      lead.topic && `📌 ${esc(lead.topic)}`,
      (lead.meet || lead.pref_day || lead.pref_slot) && `🗓 ${esc([lead.meet, lead.pref_day, lead.pref_slot].filter(Boolean).join(" · "))}`,
      lead.message && `💬 ${esc(lead.message)}`,
    ].filter(Boolean).join("\n");
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chat, text: lines, parse_mode: "HTML", disable_web_page_preview: true }),
      });
      tg = r.ok;
    } catch { tg = false; }
    await sb.from("site_leads").update({ telegram_ok: tg }).eq("id", data.id);
  }
  return json({ ok: true }, 200, origin);
});
