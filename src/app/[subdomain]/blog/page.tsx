import AnnouncementsPreview from "@/components/blog/announcement-preview";
import Header from "@/components/blog/header";
import { getSiteBySubdomain } from "@/lib/actions/site";
import { createServerSupabaseClient } from "@/utils/server";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const supabase = createServerSupabaseClient();
  const response = await getSiteBySubdomain(subdomain);
  if (!response || !response.success) {
    return <div>Site not found</div>;
  }

  // Fetch blogs for that site
  const { data, error} = await supabase
    .from("announcements")
    .select("*")
    .eq("site_id", response.data?.id)
    .order("created_at", { ascending: false });

  if (error) {
    return <div>Failed to fetch blogs</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-5 mb-10">
      <Header />
      <AnnouncementsPreview announcements={data} />
    </div>
  );
}
