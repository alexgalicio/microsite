import PrivateSite from "@/components/microsites/private-site";
import { SiteProvider } from "@/components/subdomain-provider";
import { getSiteBySubdomain } from "@/lib/actions/site";
import { Metadata } from "next";
import { NotFoundError } from "../error/not-found";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const { subdomain } = await params;
  const result = await getSiteBySubdomain(subdomain);

  if (!result || !result.success) {
    return {
      title: "Microsite",
    };
  }

  return {
    title: `${result.data?.title}`,
    description: `${result.data?.description}`,
  };
}

export default async function SubdomainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  const response = await getSiteBySubdomain(subdomain);

  if (!response || !response.success) {
    return <NotFoundError />;
  }

  if (response.data?.status !== "published") {
    return <PrivateSite />;
  }

  return (
    <SiteProvider site={response.data}>
      <div>{children}</div>
    </SiteProvider>
  );
}
