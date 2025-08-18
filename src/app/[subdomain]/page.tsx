import PrivateSite from "@/components/microsites/private-site";
import { getSiteBySubdomain, getSiteData } from "@/lib/actions/site";
import { NotFoundError } from "../error/not-found";

export default async function SubdomainPage({
  params,
}: Readonly<{
  params: Promise<{ subdomain: string }>;
}>) {
  const { subdomain } = await params;

  const site = await getSiteBySubdomain(subdomain);

  if (!site || !site.data) {
    return <NotFoundError />;
  }

  if (site.data.status === "archived" || site.data.status === "draft") {
    return <PrivateSite />;
  }

  const content = await getSiteData(site.data?.id);
  const html = content.data?.html || "";
  const css = content.data?.css || "";

  if (!content || !content.data) {
    return <PrivateSite />;
  }

  if (!content || !content.success) {
    return (
      <div className="p-4">
        <h2>Error Loading Page</h2>
        <p>{content.error}</p>
      </div>
    );
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
