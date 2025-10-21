import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// connect to supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ""
);

// get device type using useragent, (not 100% accurate hays)
function getDeviceType(userAgent: string): "Mobile" | "Desktop" | "Tablet" {
  if (/tablet|ipad/i.test(userAgent)) return "Tablet";
  if (/mobile|android|iphone/i.test(userAgent)) return "Mobile";
  return "Desktop";
}

export async function POST(req: Request) {
  try {
    // get data from the request
    const body = await req.json();
    const { websiteId, path, referrer, userAgent } = body;

    const deviceType = getDeviceType(userAgent);

    // get users IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // save to supabase
    const { error } = await supabase.from("analytics").insert([
      {
        website_id: websiteId,
        path, // the specific page path being visited
        referrer,  // where the user came from
        user_agent: userAgent, // users browser ifo
        ip,
        device_type: deviceType,
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
