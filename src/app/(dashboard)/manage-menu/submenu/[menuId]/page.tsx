import SubmenuProvider from "@/components/manage-menu/submenu/submenu-context";
import CreateAccount from "@/components/microsites/create-account";
import { DataTable } from "@/components/manage-menu/data-table";
import { columns } from "@/components/manage-menu/submenu/columns";
import { SubmenuDialogs } from "@/components/manage-menu/submenu/dialogs";
import { getMenuTitle } from "@/lib/actions/menu";
import { getTableData } from "@/lib/actions/submenu";

export default async function Page({
  params,
}: {
  params: Promise<{ menuId: string }>;
}) {
  // get menu id from route params
  const { menuId } = await params;

  // then fetch data by menu id
  const { data, error } = await getTableData(menuId);
  const menuTitle = await getMenuTitle(menuId);

  if (error || menuTitle.error) {
    return (
      <div className="p-4">
        <h2>Error Loading Submenu Table</h2>
        <p>{error || menuTitle.error}</p>
      </div>
    );
  }

  return (
    <SubmenuProvider>
      <div className="flex flex-1 flex-col gap-4">
        {/* header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {menuTitle.data}
          </h2>
          <CreateAccount />
        </div>

        {/* table */}
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <DataTable data={data} columns={columns} />
        </div>
      </div>

      {/* dialog for submenu actions */}
      <SubmenuDialogs />
    </SubmenuProvider>
  );
}
