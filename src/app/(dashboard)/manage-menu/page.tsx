import PageContainer from "@/components/layout/page-container";
import { columns } from "@/components/manage-menu/menu/menu-columns";
import MenuProvider from "@/components/manage-menu/menu/menu-context";
import { MenuDialogs } from "@/components/manage-menu/menu/dialogs";
import { MenuPrimaryButtons } from "@/components/manage-menu/menu/primary-button";
import { DataTable } from "@/components/manage-menu/data-table";
import { Menu } from "@/lib/schema";
import { createServerSupabaseClient } from "@/utils/server";
import { handleError } from "@/lib/utils";

async function getData(): Promise<Menu[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("menu").select(`
      id, 
      title,
      submenus:submenu(count)
    `);

  if (error) throw error;

  return data?.map((menu) => ({
    id: menu.id,
    title: menu.title,
    submenu_count: menu.submenus?.[0]?.count || 0,
  }));
}

export default async function Page() {
  let data: Menu[] = [];

  try {
    data = await getData();
  } catch (error) {
    console.log(handleError(error));
  }

  return (
    <PageContainer>
      <MenuProvider>
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Menu List</h2>
            <MenuPrimaryButtons />
          </div>

          <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
            <DataTable data={data} columns={columns} />
          </div>
        </div>

        <MenuDialogs />
      </MenuProvider>
    </PageContainer>
  );
}
