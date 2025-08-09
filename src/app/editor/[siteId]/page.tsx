import SiteEditor from "@/components/editor/site-editor";
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

  const { siteId } = await params;

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("id", siteId)
    .maybeSingle();

  if (error || !data) {
    return (
      <div className="p-4">
        <h2>Error Loading Editor</h2>
        <p>{error?.message}</p>
      </div>
    );
  }

  if (!(session.userId === data.user_id)) {
    redirect("/sign-in");
  }

  return <SiteEditor siteId={siteId} />;
}
