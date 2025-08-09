import AnnouncementsPreview from "@/components/announcement/announcement-preview";
import Header from "@/components/announcement/header";
import { PaginationWithLinks } from "@/components/announcement/pagination";
import { getSiteBySubdomain } from "@/lib/actions/site";
import { createServerSupabaseClient } from "@/utils/server";

export default async function Page({
  params,
  searchParams,
}: {
  params: { subdomain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { subdomain } = params;
  const page = parseInt(searchParams?.page as string || "1");
  const pageSize = parseInt(searchParams?.pageSize as string || "2");

  const supabase = createServerSupabaseClient();
  const response = await getSiteBySubdomain(subdomain);
  
  if (!response || !response.success) {
    return <div>Site not found</div>;
  }

  // Calculate the range of records to fetch
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Fetch announcements with pagination
  const { data, error, count } = await supabase
    .from("announcements")
    .select("*", { count: 'exact' })
    .eq("site_id", response.data?.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return <div>Failed to fetch announcements</div>;
  }

  console.log('from', from, 'to', to)
  console.log('page', page, 'pagesise', pageSize)
  console.log('count', count)

  return (
    <div className="max-w-6xl mx-auto px-5 mb-10">
      <Header />
      <AnnouncementsPreview announcements={data || []} />
      <div className="mt-8">
        <PaginationWithLinks
          page={page}
          pageSize={pageSize}
          totalCount={count || 0}
          navigationMode="router"
        />
      </div>
    </div>
  );
}