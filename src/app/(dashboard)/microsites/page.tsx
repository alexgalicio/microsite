import SiteProvider from "@/components/microsites/site-context";
import PageItem from "@/components/microsites/site-item";
import SearchMicrosites from "@/components/microsites/admin-microsites";
import CreateAccount from "@/components/microsites/create-account";
import { SiteDialogs } from "@/components/microsites/dialogs";
import { CreateSiteButton } from "@/components/microsites/create-site";
import { getAllSite, getSiteByUserId } from "@/lib/actions/site";
import { Site } from "@/lib/schema";
import { checkRole } from "@/utils/role";
import { auth } from "@clerk/nextjs/server";
import { EmptyState } from "@/components/ui/empty-state";
import { Globe } from "lucide-react";
import { redirect } from "next/navigation";
import { PaginationWithLinks } from "@/components/announcement/pagination";

export default async function SitePages({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const isAdmin = await checkRole("admin");

  const params = await searchParams;

  const page = parseInt((params?.page as string) || "1");
  const pageSize = parseInt((params?.pageSize as string) || "9");
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let result,
    totalCount = 0;
  if (isAdmin) {
    result = await getAllSite(from, to);
    totalCount = result.count || 0;
  } else {
    result = await getSiteByUserId(userId);
  }

  if (result.error) {
    <div className="p-4">
      <h2>Error Loading Sites</h2>
      <p>{result.error}</p>
    </div>;
  }

  return (
    <SiteProvider>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Microsites</h2>
          {isAdmin ? <CreateAccount /> : <CreateSiteButton />}
        </div>
        {isAdmin ? (
          <>
            <SearchMicrosites sites={result.data || []} />
            {totalCount > pageSize && (
              <PaginationWithLinks
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                navigationMode="router"
              />
            )}
          </>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {result.data && result.data.length > 0 ? (
              result.data.map((site: Site) => (
                <PageItem key={site.id} site={site} />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  title="No Microsite Found"
                  description="Get started by creating a new site."
                  icon={<Globe className="w-6 h-6 text-muted-foreground" />}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <SiteDialogs />
    </SiteProvider>
  );
}
