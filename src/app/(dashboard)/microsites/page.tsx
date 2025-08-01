import PageContainer from "@/components/layout/page-container";
import { SiteDialogs } from "@/components/microsites/dialogs";
import SiteProvider from "@/components/microsites/site-context";
import PageItem from "@/components/microsites/site-item";
import { SitePrimaryButtons } from "@/components/microsites/site-primary-buttons";
import SearchMicrosites from "@/components/microsites/toolbar";
import { getAllSite, getSiteById } from "@/lib/actions";
import { checkRole } from "@/utils/role";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();

  let response;
  const isAdmin = await checkRole("admin");
  if (isAdmin) {
    response = await getAllSite();
  } else {
    response = await getSiteById(userId || "");
  }

  if (response.error) {
    return <div>error {response.error}</div>;
  }

  const sites = response.data || [];

  return (
    <PageContainer>
      <SiteProvider>
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Microsites</h2>
            <SitePrimaryButtons />
          </div>
          {isAdmin ? (
            <SearchMicrosites sites={sites} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sites.map((site) => (
                <PageItem key={site.id} site={site} />
              ))}
            </div>
          )}
        </div>
        <SiteDialogs />
      </SiteProvider>
    </PageContainer>
  );
}
