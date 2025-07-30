import { getSiteBySubdomain } from "@/lib/actions";

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;

  const result = await getSiteBySubdomain(domain.toString());

  // Handle error case
  if (result.error || !result.data) {
    return <div>Error: {result.error || "Site not found"}</div>;
  }

  return `Site name ${result.data[0]?.title}`;
}
