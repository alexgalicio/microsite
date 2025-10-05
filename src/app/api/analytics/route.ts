import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ""
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { websiteId, path, referrer, userAgent } = body;

    // get IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    const { error } = await supabase.from("analytics").insert([
      {
        website_id: websiteId,
        path,
        referrer,
        user_agent: userAgent,
        ip,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Analytics route error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
