import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Inbox } from "lucide-react";

interface MailListProps {
  items: Mail[];
  selectedId: string | null;
  onSelectMail: (id: string) => void;
}

export function MailList({ items, selectedId, onSelectMail }: MailListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="flex flex-col gap-2 pt-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Inbox className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              No notifications
            </h3>
            <p className="text-sm text-muted-foreground">
              You&apos;re all caught up! No notifications to show.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                selectedId === item.id && "bg-muted"
              )}
              onClick={() => {
                onSelectMail(item.id);
              }}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.name}</div>
                    {!item.is_read && (
                      <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "ml-auto text-xs",
                      selectedId === item.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatDistanceToNow(new Date(item.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {item.message.substring(0, 300)}
              </div>
            </button>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
