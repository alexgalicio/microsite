import { getTopPerformingSite } from "@/lib/actions/analytics";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function RecentSitesTable() {
  const data = await getTopPerformingSite();

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
