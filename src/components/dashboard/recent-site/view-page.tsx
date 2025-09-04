import { getLatestUpdateSites } from "@/lib/actions/analytics";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function RecentSitesTable() {
  const data = await getLatestUpdateSites();

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
