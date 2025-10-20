"use client"

import { SidebarNav } from "@/components/settings/sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { Bolt, ShieldCheck, User } from "lucide-react";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
    icon: <User size={18} />,
  },
  {
    title: "Security",
    href: "/settings/security",
    icon: <ShieldCheck size={18} />,
  },
  {
    title: "Configure",
    href: "/settings/configure",
    icon: <Bolt size={18} />,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata.role === "admin";

  const filteredItems = isAdmin
    ? sidebarNavItems
    : sidebarNavItems.filter((item) => item.title !== "Configure");

  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight">Settings</h2>

      <Separator className="my-4 lg:my-6" />

      <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="top-0 lg:sticky lg:w-1/5">
          <SidebarNav items={filteredItems} />
        </aside>
        <div className="flex w-full overflow-y-hidden p-1">
          <div className="flex flex-1 flex-col">
            <div className="lg:max-w-xl">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
