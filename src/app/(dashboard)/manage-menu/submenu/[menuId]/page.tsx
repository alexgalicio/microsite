import PageContainer from "@/components/layout/page-container";
import { DataTable } from "@/components/manage-menu/data-table";
import { columns } from "@/components/manage-menu/submenu/columns";
import SubmenuProvider from "@/components/manage-menu/submenu/submenu-context";
import { SubmenuDialogs } from "@/components/manage-menu/submenu/dialogs";
import CreateAccount from "@/components/microsites/create-account";
import { Submenu } from "@/lib/schema";
import { createServerSupabaseClient } from "@/utils/server";
import { getMenuTitle } from "@/lib/actions";

async function getData(
  menuId: string
): Promise<{ data: Submenu[]; error: string | null }> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("submenu")
    .select(
      `
      id,
      title,
      menu_id,
      profiles:user_id(email)
    `
    )
    .eq("menu_id", menuId);

  if (error) return { data: [], error: error.message };

  return { data: data, error: null };
}

export default async function Page({
  params,
}: {
  params: Promise<{ menuId: string }>;
}) {
  const { menuId } = await params;
  const { data, error } = await getData(menuId);
  const result = await getMenuTitle(menuId);

  if (error || result.error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-red-600">
          Error Loading Submenu Table
        </h2>
        <p className="text-gray-600">{error || result.error}</p>
      </div>
    );
  }

  return (
    <PageContainer>
      <SubmenuProvider>
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{result.data}</h2>
            <CreateAccount />
          </div>
          <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
            <DataTable data={data} columns={columns} />
          </div>
        </div>
        <SubmenuDialogs />
      </SubmenuProvider>
    </PageContainer>
  );
}
