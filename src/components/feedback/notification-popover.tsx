"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUnreadFeedback } from "@/lib/actions/feedback";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { Feedback } from "@/lib/types";

export default function NotificationPopover() {
  const router = useRouter();
  const { session } = useSession();
  const [notifications, setNotifications] = useState<Feedback[]>([]);
  const [open, setOpen] = useState(false);

  const DISPLAY_LIMIT = 5;
  const unreadCount = notifications.filter((notif) => !notif.is_read).length;
  const displayedNotifications = notifications.slice(0, DISPLAY_LIMIT);
  const hasMoreNotifications = notifications.length > DISPLAY_LIMIT;

  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        async accessToken() {
          return session?.getToken() ?? null;
        },
      }
    );
  }

  useEffect(() => {
    async function loadNotifications() {
      const response = await getUnreadFeedback();
      if (response.success && response.data) {
        setNotifications(response.data);
      } else {
        setNotifications([]);
      }
    }

    loadNotifications();

    const supabase = createClerkSupabaseClient();
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new as Feedback, ...prev]);
          }
          if (payload.eventType === "UPDATE") {
            setNotifications((prev) =>
              prev.map((n) =>
                n.id === payload.new.id ? (payload.new as Feedback) : n
              )
            );
          }
          if (payload.eventType === "DELETE") {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex justify-between border-b px-6 py-4 ">
          <div className="font-medium">Notifications</div>
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-center text-xs p-0 h-auto"
            )}
          >
            View all
          </Link>
        </div>

        {notifications.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground text-center">
            No new notifications
          </div>
        ) : (
          <ScrollArea className="h-80">
            <ul className="divide-y">
              {displayedNotifications.map((notif) => (
                <li
                  key={notif.id}
                  onClick={() => {
                    setOpen(false);
                    router.push("/notifications");
                  }}
                  className="p-4 text-sm hover:bg-muted cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">
                        {notif.name}
                      </div>
                      <div className="text-muted-foreground text-xs line-clamp-1">
                        {notif.message}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(notif.created_at), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>

                    <div className="flex-shrink-0 mt-1">
                      {!notif.is_read ? (
                        <div className="h-2 w-2 bg-blue-600 rounded-full" />
                      ) : (
                        <div className="h-2 w-2" />
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {hasMoreNotifications && (
              <div className="p-3 text-center border-t">
                <Link
                  href="/notifications"
                  onClick={() => setOpen(false)}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  +{notifications.length - DISPLAY_LIMIT} more notifications
                </Link>
              </div>
            )}
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
