import { NotFoundError } from "@/app/error/not-found";
import Header from "@/components/links/header";
import SearchableLinks from "@/components/links/search-link";
import { getLinksBySiteId } from "@/lib/actions/links";
import { getSiteBySubdomain } from "@/lib/actions/site";

export default async function Page({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const response = await getSiteBySubdomain(subdomain);
  if (!response || !response.success) {
    return <NotFoundError />;
  }

  const links = await getLinksBySiteId(response.data?.id);
  if (!links.success) {
    return (
      <div className="p-4">
        <h2>Error Loading Links</h2>
        <p>{links.error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 h-screen flex flex-col">
      <Header />
      <SearchableLinks links={links.data || []} />
    </div>
  );
}
