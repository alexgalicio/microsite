import LinkProvider from "@/components/links/link-context";
import LinksList from "@/components/links/links-list";
import { PaginationWithLinks } from "@/components/announcement/pagination";
import { CreateLinkButton } from "@/components/links/create-link";
import { LinkDialogs } from "@/components/links/dialog";
import { getLinksByUserId } from "@/lib/actions/links";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { checkRole } from "@/utils/role";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // get logged in user
  const { userId } = await auth();

  // if not logged in, redirect to sign in
  if (!userId) {
    redirect("/sign-in");
  }

  // admins cant view this page
  const isAdmin = await checkRole("admin");
  if (isAdmin) {
    redirect("/forbidden");
  }

  // for pagination
  const params = await searchParams;
  const page = parseInt((params?.page as string) || "1");
  const pageSize = parseInt((params?.pageSize as string) || "9");
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const response = await getLinksByUserId(userId, from, to);

  if (response.error) {
    <div className="p-4">
      <h2>Error Loading Links</h2>
      <p>{response.error}</p>
    </div>;
  }

  const links = response.data || [];
  const totalCount = response.count || 0;

  return (
    <LinkProvider>
      <div className="flex flex-1 flex-col gap-4">
        {/* header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Links</h2>
          <div className="space-x-2">
            <CreateLinkButton />
          </div>
        </div>

        {/* links list */}
        <LinksList links={links} />

        {/* show pagination only if there are more than one page */}
        {totalCount > pageSize && (
          <PaginationWithLinks
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            navigationMode="router"
          />
        )}
      </div>
      <LinkDialogs />
    </LinkProvider>
  );
}
