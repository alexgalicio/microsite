import PrivateSite from "@/components/microsites/private-site";
import { SiteProvider } from "@/components/subdomain-provider";
import { getSiteBySubdomain } from "@/lib/actions/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// set up page title and desc
export async function generateMetadata({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  // get subdomain from url
  const { subdomain } = await params;

  // fetch site details by subdomain
  const result = await getSiteBySubdomain(subdomain);

  // use default title if no site or error
  if (!result || !result.success) {
    return {
      title: "Microsite",
    };
  }

  // return title and desc for page info
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
  // get subdomain from url
  const { subdomain } = await params;

   // fetch site details by subdomain
  const response = await getSiteBySubdomain(subdomain);

  // if no site or error, show 404 page
  if (!response || !response.success) {
    return notFound();
  }

  // if site exist but not published yet, show private page
  if (response.data?.status !== "published") {
    return <PrivateSite />;
  }

  // show site
  return (
    <SiteProvider site={response.data}>
      <div>{children}</div>
    </SiteProvider>
  );
}
