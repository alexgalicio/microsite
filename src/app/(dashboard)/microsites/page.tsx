import PageContainer from "@/components/layout/page-container";
import NewMicrosite from "@/components/microsites/new-site";
import PageItem from "@/components/microsites/site-item";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { readSite } from "@/lib/actions";
import { Site } from "@/lib/types";
import Link from "next/link";

export default async function Page() {
  const response = await readSite();

  if (response.error) {
    return <div>error {response.error}</div>;
  }

  const sites = response.data || [];

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-start justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Microsites</h2>
          <NewMicrosite />
        </div>

        {/* search and filter */}

        <div className="grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
          {sites.length >= 1 ? (
            sites.map((site) => <PageItem key={site.id} site={site} />)
          ) : (
            <p className="mt-4 text-center text-muted-foreground">
              It&apos;s pretty empty in here, create a site to get started.
            </p>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
