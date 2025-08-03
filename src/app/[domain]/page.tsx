import { getSiteBySubdomain } from "@/lib/actions/site";
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
    description: `Subdomain page for ${domain}`,
  };
}

export default async function SubdomainPage({
  params,
}: Readonly<{
  params: Promise<{ domain: string }>;
}>) {
  const { domain } = await params;
  const site = await getSiteBySubdomain(domain);

  if (site.success === false) {
    console.error("not found");
  }

  const grapesjsData = site.data?.grapesjs || []; // Default to an empty array if undefined
  const htmlContent = grapesjsData.length > 0 ? grapesjsData[0].html : ""; // Get HTML if available
  const cssContent = grapesjsData.length > 0 ? grapesjsData[0].css : ""; // Get CSS if available

  return (
    <div className="main-component">
      {/* Render your HTML/CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: cssContent,
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: htmlContent,
        }}
      />
    </div>
  );
}
