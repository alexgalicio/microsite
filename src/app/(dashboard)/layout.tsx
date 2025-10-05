import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <div
          className={cn(
            'has-[[data-layout=fixed]]:h-svh',
            "peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]"
          )}
        >
          <Header />
          <Main>{children}</Main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
