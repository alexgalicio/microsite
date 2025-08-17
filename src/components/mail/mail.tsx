"use client";

import { MailList } from "./mail-list";
import { MailDisplay } from "./mail-display";
import { type Mail } from "@/lib/types";
import {
  deleteNotification,
  markAllNotificationsAsRead,
  markNotificationsAsRead,
} from "@/lib/actions/notification";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface MailProps {
  mails: Mail[];
}

export function Mail({ mails: initialMails }: MailProps) {
  const { session } = useSession();
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
  const [mails, setMails] = useState<Mail[]>(initialMails);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

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
    const supabase = createClerkSupabaseClient();
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMails((prev) => [payload.new as Mail, ...prev]);
          }
          if (payload.eventType === "UPDATE") {
            setMails((prev) =>
              prev.map((mail) =>
                mail.id === payload.new.id ? (payload.new as Mail) : mail
              )
            );
          }
          if (payload.eventType === "DELETE") {
            setMails((prev) =>
              prev.filter((mail) => mail.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMailId]);

  const handleSelectMail = async (id: string) => {
    setSelectedMailId(id);
    const selectedMail = mails.find((mail) => mail.id === id);

    if (selectedMail && !selectedMail.is_read) {
      const response = await markNotificationsAsRead(id);
      if (response.success === false) {
        toast.error(handleError(response.error));
      }
    }

    if (isMobile) {
      setIsDrawerOpen(true);
    }
  };

  const handleMarkAllAsRead = async () => {
    const response = await markAllNotificationsAsRead();
    if (response.success === false) {
      toast.error(handleError(response.error));
    }
  };

  const handleDeleteNotif = async (id: string) => {
    const response = await deleteNotification(id);
    if (response.success) {
      toast.success("Notification deleted successfully");
    } else {
      toast.error(handleError(response.error));
    }
  };

  return (
    <div className="flex ">
      <div className="flex-1">
        <Tabs defaultValue="all">
          <div className="flex items-center pb-2">
            <h1 className="text-xl font-bold">Notifications</h1>
            <TabsList className="ml-auto">
              <TabsTrigger
                value="all"
                className="text-zinc-600 dark:text-zinc-200"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="text-zinc-600 dark:text-zinc-200"
              >
                Unread
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="m-0">
            <MailList
              items={mails}
              selectedId={selectedMailId}
              onSelectMail={handleSelectMail}
            />
          </TabsContent>
          <TabsContent value="unread" className="m-0">
            <MailList
              items={mails.filter((item) => !item.is_read)}
              selectedId={selectedMailId}
              onSelectMail={handleSelectMail}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* display panel */}
      {!isMobile && (
        <div className="pl-4 w-1/3">
          <MailDisplay
            mail={mails.find((item) => item.id === selectedMailId) || null}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDelete={handleDeleteNotif}
          />
        </div>
      )}

      {/* display drawer on small screen */}
      {isMobile && (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Notification</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <MailDisplay
                mail={mails.find((item) => item.id === selectedMailId) || null}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDelete={handleDeleteNotif}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
