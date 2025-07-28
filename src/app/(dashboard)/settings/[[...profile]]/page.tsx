import { UserProfile } from "@clerk/nextjs";
import PageContainer from "@/components/layout/page-container";

export default function Page() {
  return (
    <PageContainer>
      <UserProfile />
    </PageContainer>
  );
}
