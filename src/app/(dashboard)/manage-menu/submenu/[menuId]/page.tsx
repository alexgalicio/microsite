import PageContainer from "@/components/layout/page-container";

import { DataTable } from "@/components/manage-menu/data-table";
import { columns } from "@/components/manage-menu/submenu/columns";
import SubmenuProvider from "@/components/manage-menu/submenu/submenu-context";
import { SubmenuDialogs } from "@/components/manage-menu/submenu/dialogs";
import CreateAccount from "@/components/microsites/create-account-button";
import { Submenu } from "@/lib/schema";
import { createServerSupabaseClient } from "@/utils/server";

async function getData(menuId: string): Promise<Submenu[]> {
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

  if (error) throw error;

  return data;
}

async function getMenuTitle(menuId: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("menu")
    .select("title")
    .eq("id", menuId)
    .single();

  if (error) throw error;

  return data.title;
}

// menu/submenu/[menuId]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ menuId: string }>;
}) {
  const { menuId } = await params;
  const data = await getData(menuId);
  const menuName = await getMenuTitle(menuId)
  console.log(data);

  return (
    <PageContainer>
      <SubmenuProvider>
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{menuName}</h2>
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
