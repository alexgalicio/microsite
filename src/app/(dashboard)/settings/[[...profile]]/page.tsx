import { UserProfile } from "@clerk/nextjs";
import PageContainer from "@/components/layout/page-container";

export default function ProfileViewPage() {
  return (
    <PageContainer>
      <UserProfile />
    </PageContainer>
  );
}
