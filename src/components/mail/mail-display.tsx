import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Button, buttonVariants } from "../ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mail } from "@/lib/types";

interface MailDisplayProps {
  mail: Mail | null;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

export function MailDisplay({
  mail,
  onMarkAllAsRead,
  onDelete,
}: MailDisplayProps) {
  return (
    <div className="flex h-full flex-col border">
      <div className="flex justify-between items-center p-2">
        <button
          className={cn(
            buttonVariants({ variant: "link" }),
            "text-center text-xs p-2 h-auto"
          )}
          onClick={onMarkAllAsRead}
        >
          Mark all as read
        </button>

        <div className="flex items-center">
          <div className="w-px h-6 bg-border mx-2" />
          <Button
            variant="ghost"
            size="icon"
            disabled={!mail}
            onClick={() => mail && onDelete(mail.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

      <Separator />
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <div className="grid gap-1">
                <div className="font-semibold">{mail.name}</div>
                <div className="line-clamp-1 text-xs">{mail.email}</div>
              </div>
            </div>
            {mail.created_at && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(mail.created_at), "PPp")}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            {mail.message}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No notification selected
        </div>
      )}
    </div>
  );
}
