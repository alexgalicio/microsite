import { getSiteBySubdomain, getSiteData } from "@/lib/actions/site";
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

export default async function SubdomainPage({
  params,
}: Readonly<{
  params: Promise<{ subdomain: string }>;
}>) {
  const { subdomain } = await params;
  const site = await getSiteBySubdomain(subdomain);

  if (site.data?.status === "archived" || site.data?.status === "draft") {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <h1 className="text-xl font-medium">The requested site is private.</h1>
      </div>
    );
  }

  const content = await getSiteData(site.data?.id);
  const html = content.data?.html || "";
  const css = content.data?.css || "";

  if (!content || !content.success) {
    return <div>No content available</div>;
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: css,
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </>
  );
}
