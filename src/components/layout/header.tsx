"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumbs } from "../breadcrumbs";
import { UserNav } from "./user-nav";
import { useUser } from "@clerk/nextjs";
import NotificationPopover from "@/components/feedback/notification-popover";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function Header({ className, ...props }: HeaderProps) {
  const [offset, setOffset] = React.useState(0);

  const { user } = useUser();
  const isAdmin = user?.publicMetadata.role === "admin";

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // add scroll listener to the body
    document.addEventListener("scroll", onScroll, { passive: true });

    // clean up the event listener on unmount
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "bg-background flex h-16 items-center gap-3 p-4 sm:gap-4",
        "header-fixed peer/header sticky z-50 top-0 w-[inherit]",
        offset > 10 ? "shadow" : "shadow-none rounded-t-xl",
        className
      )}
      {...props}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumbs />

      <div className="ml-auto flex items-center gap-4">
        {isAdmin && <NotificationPopover />}
        <UserNav />
      </div>
    </header>
  );
}
