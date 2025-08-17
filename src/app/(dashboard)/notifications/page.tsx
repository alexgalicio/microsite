import { Mail } from "@/components/mail/mail";
import { getAllNotifications } from "@/lib/actions/notification";

export default async function Page() {
  const { data, error } = await getAllNotifications();

  if (error) {
    return (
      <div className="p-4">
        <h2>Error Loading Notifications Page</h2>
        <p>{error}</p>
      </div>
    );
  }

  return <Mail mails={data} />;
}
