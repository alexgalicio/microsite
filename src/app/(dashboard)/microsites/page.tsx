import PageContainer from "@/components/layout/page-container";
import SiteProvider from "@/components/microsites/site-context";
import PageItem from "@/components/microsites/site-item";
import SearchMicrosites from "@/components/microsites/admin-microsites";
import { SiteDialogs } from "@/components/microsites/dialogs";
import { CreateSiteButton } from "@/components/microsites/create-site";
import { getAllSite, getSiteById } from "@/lib/actions/site";
import { Site } from "@/lib/schema";
import { checkRole } from "@/utils/role";
import { auth } from "@clerk/nextjs/server";

export default async function SitesPage() {
  const { userId } = await auth();

  const isAdmin = await checkRole("admin");

  let result;
  if (isAdmin) {
    result = await getAllSite();
  } else {
    result = await getSiteById(userId || "");
  }

  if (result.error) {
    <div className="p-4">
      <h2>Error Loading Sites</h2>
      <p>{result.error}</p>
    </div>;
  }

  return (
    <PageContainer>
      <SiteProvider>
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Microsites</h2>
            <CreateSiteButton />
          </div>

          {isAdmin ? (
            <SearchMicrosites sites={result.data || []} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {result.data && result.data.length > 0 ? (
                result.data.map((site: Site) => (
                  <PageItem key={site.id} site={site} />
                ))
              ) : (
                <div className="col-span-full mt-16">
                  <p className="text-center text-muted-foreground">
                    Create a site to get started.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <SiteDialogs />
      </SiteProvider>
    </PageContainer>
  );
}
