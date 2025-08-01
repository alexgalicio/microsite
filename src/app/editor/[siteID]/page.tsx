import { createServerSupabaseClient } from "@/utils/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    siteId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { userId } = await auth();

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return <div>Sign in to view this page</div>;
  }
  // const session = await auth();

  // console.log("session", session);

  // const { siteId } = await params;
  // if (!siteId) {
  //   console.log("siteId is undefined");
  // }

  // const supabase = createServerSupabaseClient();
  // const { data, error } = await supabase
  //   .from("sites")
  //   .select("*")
  //   .eq("id", siteId)
  //   .single();

  // if (error) {
  //   console.error("Error fetching site:", error);
  // }

  // if (!data || !(session.userId === data.user_id)) {
  //   redirect("/sign-in");
  // }

  // console.log("session", session.userId);
  // console.log("userId", data.user_id);

  return (
    <div>
      <>
        <h1>Editor Page</h1>
      </>
    </div>
  );
}
