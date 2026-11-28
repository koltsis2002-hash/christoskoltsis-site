import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// Φέρνει βαθμολογία και κριτικές από το Google Business Profile του Χρήστου (Places API)
// και τις κρατά για 24 ώρες, ώστε η Google να καλείται το πολύ μία φορά τη μέρα.
// Θέλει τα secrets GOOGLE_PLACES_KEY και GOOGLE_PLACE_ID· χωρίς αυτά απαντά { configured: false }.
const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" };
const json = (o: unknown) => new Response(JSON.stringify(o), { headers });
const DAY = 24 * 3600e3, RETRY = 3600e3;

type G = {
  rating?: number; userRatingCount?: number; googleMapsUri?: string;
  reviews?: { rating?: number; text?: { text?: string }; originalText?: { text?: string }; relativePublishTimeDescription?: string; publishTime?: string; authorAttribution?: { displayName?: string; uri?: string } }[];
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  const key = Deno.env.get("GOOGLE_PLACES_KEY"), place = Deno.env.get("GOOGLE_PLACE_ID");
  if (!key || !place) return json({ configured: false });

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data: cache } = await sb.from("google_reviews_cache").select("data, ok, fetched_at").eq("id", 1).maybeSingle();
  const age = cache ? Date.now() - new Date(cache.fetched_at).getTime() : Infinity;
  if (cache && age < (cache.ok ? DAY : RETRY)) return json(cache.data ?? { configured: true });

  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(place)}?languageCode=el`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews" },
    });
    if (!r.ok) throw new Error("google " + r.status);
    const g: G = await r.json();
    const data = {
      configured: true,
      rating: g.rating ?? null,
      count: g.userRatingCount ?? 0,
      url: g.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${place}`,
      writeUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(place)}`,
      reviews: (g.reviews ?? []).map((v) => ({
        author: v.authorAttribution?.displayName ?? "",
        authorUrl: v.authorAttribution?.uri ?? null,
        rating: v.rating ?? 0,
        text: v.originalText?.text ?? v.text?.text ?? "",
        when: v.relativePublishTimeDescription ?? "",
      })),
    };
    await sb.from("google_reviews_cache").upsert({ id: 1, data, ok: true, fetched_at: new Date().toISOString() });
    return json(data);
  } catch {
    // Αν η Google δεν απαντήσει, κρατάμε τις παλιές κριτικές και ξαναδοκιμάζουμε σε μία ώρα
    await sb.from("google_reviews_cache").upsert({ id: 1, data: cache?.data ?? null, ok: false, fetched_at: new Date().toISOString() });
    return json(cache?.data ?? { configured: true });
  }
});
