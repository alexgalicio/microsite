import { getSiteBySubdomain } from "@/lib/actions/site";
import { Metadata } from "next";

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
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
