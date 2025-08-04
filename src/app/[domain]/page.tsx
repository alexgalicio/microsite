import { getSiteBySubdomain, getSiteData } from "@/lib/actions/site";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const result = await getSiteBySubdomain(domain);

  if (!result || result.success === false) {
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
  params: Promise<{ domain: string }>;
}>) {
  const { domain } = await params;
  const site = await getSiteBySubdomain(domain);

  const content = await getSiteData(site.data?.id);
  const html = content.data?.html || "";
  const css = content.data?.css || "";

  if (!content || content.success === false) {
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
