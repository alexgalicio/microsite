import { getSiteBySubdomain } from "@/lib/actions/site";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const result = await getSiteBySubdomain(domain);

  if (!result || result.error) {
    return {
      title: "Microsite",
    };
  }

  return {
    title: `${result.title}`,
    description: `Subdomain page for ${domain}`,
  };
}

export default async function SubdomainPage({
  params,
}: Readonly<{
  params: Promise<{ domain: string }>;
}>) {
  const { domain } = await params;
  const result = await getSiteBySubdomain(domain);

  if (!result || result.error) {
    console.error("not found")
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Welcome to {result ? result.title : "Microsite"}
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          This is your custom subdomain page
        </p>
      </div>
    </div>
  );
}
