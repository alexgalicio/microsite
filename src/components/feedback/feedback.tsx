"use client";

import { FeedbackList } from "./feedback-list";
import { FeedbackDisplay } from "./feedback-display";
import { type Feedback } from "@/lib/types";
import {
  deleteFeedback,
  markAllFeedbackAsRead,
  markFeedbackAsRead,
} from "@/lib/actions/feedback";
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

interface FeedbackProps {
  feedbacks: Feedback[];
}

export function Feedback({ feedbacks: initialFeedbacks }: FeedbackProps) {
  const { session } = useSession();
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
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
      .channel("feedback")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feedback" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setFeedbacks((prev) => [payload.new as Feedback, ...prev]);
          }
          if (payload.eventType === "UPDATE") {
            setFeedbacks((prev) =>
              prev.map((feedback) =>
                feedback.id === payload.new.id ? (payload.new as Feedback) : feedback
              )
            );
          }
          if (payload.eventType === "DELETE") {
            setFeedbacks((prev) =>
              prev.filter((feedback) => feedback.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFeedbackId]);

  const handleSelectedFeedback = async (id: string) => {
    setSelectedFeedbackId(id);
    const selectedFeedback = feedbacks.find((feedback) => feedback.id === id);

    if (selectedFeedback && !selectedFeedback.is_read) {
      const response = await markFeedbackAsRead(id);
      if (response.success === false) {
        toast.error(handleError(response.error));
      }
    }

    if (isMobile) {
      setIsDrawerOpen(true);
    }
  };

  const handleMarkAllAsRead = async () => {
    const response = await markAllFeedbackAsRead();
    if (response.success === false) {
      toast.error(handleError(response.error));
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    const response = await deleteFeedback(id);
    if (response.success) {
      toast.success("Feedback deleted successfully");
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
            <FeedbackList
              items={feedbacks}
              selectedId={selectedFeedbackId}
              onSelectFeedback={handleSelectedFeedback}
            />
          </TabsContent>
          <TabsContent value="unread" className="m-0">
            <FeedbackList
              items={feedbacks.filter((item) => !item.is_read)}
              selectedId={selectedFeedbackId}
              onSelectFeedback={handleSelectedFeedback}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* display panel */}
      {!isMobile && (
        <div className="pl-4 w-1/3">
          <FeedbackDisplay
            feedback={feedbacks.find((item) => item.id === selectedFeedbackId) || null}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDelete={handleDeleteFeedback}
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
              <FeedbackDisplay
                feedback={feedbacks.find((item) => item.id === selectedFeedbackId) || null}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDelete={handleDeleteFeedback}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
