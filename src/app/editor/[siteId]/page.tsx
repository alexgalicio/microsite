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
    .single();

  if (error) {
    console.error("Error fetching site:", error);
  }

  if (!data || !(session.userId === data.user_id)) {
    redirect("/sign-in");
  }

  return (
    <div>
      <>
        <h1>Editor Page</h1>
        <h1>Site data: {JSON.stringify(data)}</h1>
      </>
    </div>
  );
}
