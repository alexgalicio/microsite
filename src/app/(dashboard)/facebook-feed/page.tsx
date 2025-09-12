import FacebookForm from "@/components/facebook-feed/facebook-form";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight">Facebook Feed</h2>

      <FacebookForm userId={userId || ""} />
    </div>
  );
}
