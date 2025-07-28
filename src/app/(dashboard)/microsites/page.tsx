import PageContainer from "@/components/layout/page-container";
import CreateAccount from "@/components/microsites/create-account-button";

export default async function Page() {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Microsite</h2>
          <CreateAccount />
        </div>

        {/* <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
            microsite table
          </div> */}
      </div>
    </PageContainer>
  );
}
