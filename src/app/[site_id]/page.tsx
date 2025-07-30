import { readSiteById } from "@/lib/actions";

export default async function Page({
  params,
}: {
  params: Promise<{ site_id: string }>;
}) {
  const { site_id } = await params;

  const result = await readSiteById(site_id);

  // Handle error case
  if (result.error || !result.data) {
    return <div>Error: {result.error || "Site not found"}</div>;
  }

  return `Site name ${result.data[0]?.title}`;
}
