import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// connect to db
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ""
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("siteId");

  if (!siteId) {
    return NextResponse.json({ error: "Missing siteId" }, { status: 400 });
  }

  // get the site's user_id
  const { data: site, error: siteError } = await supabase
    .from("sites")
    .select("user_id")
    .eq("id", siteId)
    .single();

  if (siteError || !site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  // get facebook credentials for that user
  const { data: fb, error: fbError } = await supabase
    .from("facebook_feed")
    .select("page_id, access_token")
    .eq("user_id", site.user_id)
    .single();

  if (fbError || !fb) {
    return NextResponse.json({ error: "No FB page linked" }, { status: 404 });
  }

  try {
    // use fb graph api to fetch page info and posts
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${fb.page_id}?fields=name,picture{url},posts{message,full_picture,created_time,permalink_url}&access_token=${fb.access_token}`
    );

    const fbData = await res.json();
    return NextResponse.json(fbData);
  } catch (err) {
    console.log("Error: " + err);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
