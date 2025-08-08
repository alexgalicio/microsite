import AnnouncementViewPage from "@/components/blog/announcement-view-page";

export default async function PostPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  return <AnnouncementViewPage id={params.id} />;
}
