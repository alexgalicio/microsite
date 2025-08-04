import MenuProvider from "@/components/manage-menu/menu/menu-context";
import { columns } from "@/components/manage-menu/menu/columns";
import { MenuDialogs } from "@/components/manage-menu/menu/dialogs";
import { CreateMenuButton } from "@/components/manage-menu/menu/create-menu";
import { DataTable } from "@/components/manage-menu/data-table";
import { getTableData } from "@/lib/actions/menu";

export default async function Page() {
  const { data, error } = await getTableData();

  if (error) {
    return (
      <div className="p-4">
        <h2>Error Loading Menu Table</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <MenuProvider>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Menu List</h2>
          <CreateMenuButton />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <DataTable data={data} columns={columns} />
        </div>
      </div>
      <MenuDialogs />
    </MenuProvider>
  );
}
