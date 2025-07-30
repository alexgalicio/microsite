import PageContainer from "@/components/layout/page-container";
import NewMicrosite from "@/components/microsites/new-site";
import { Card } from "@/components/ui/card";
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
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Microsites</h2>
          <NewMicrosite />
        </div>

        {sites?.length > 0 ? (
          <div className="flex flex-wrap  gap-2 w-full">
            {sites?.map((site: Site) => (
              <Link
                key={site?.id}
                href={`/cms/sites/${site?.id}`}
                prefetch={true}
                className="flex flex-col rounded-md w-[350px] hover:cursor-pointer hover:shadow-2xl hover:shadow-purple-500/50 transition-shadow duration-300"
              >
                <Card className="flex flex-col px-[1rem] justify-between h-full py-[1rem]">
                  <div className="flex flex-col w-full justify-center items-startxw">
                    <h2 className="text-lg font-bold">{site?.title}</h2>
                  </div>
                  <div className="flex justify-between mt-2 items-center w-full">
                    <p className="text-xs px-2 py-1 rounded-full border bg-zinc-900 text-gray-300">
                      {site?.subdomain}.{process.env.BASE_DOMAIN}
                    </p>
                    <p className="text-xs text-muted-foreground ">
                      {new Date(site?.created_at)?.toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p>no site yet</p>
        )}
      </div>
    </PageContainer>
  );
}
