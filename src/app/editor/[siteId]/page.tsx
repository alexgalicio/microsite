import DefaultEditor from "@/components/editor/site-editor";
import { createServerSupabaseClient } from "@/utils/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    siteId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const session = await auth();
  console.log("Session:", session);
  
  const { siteId } = await params;
  console.log("Site ID:", siteId);
  
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("id", siteId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching site:", error);
  }

  if (!data) {
    console.error("No site data found for ID:", siteId);
  }

  if (!(session.userId === data.user_id)) {
    redirect("/sign-in");
  }

  return (
    <DefaultEditor siteId={siteId} />
  );
}
