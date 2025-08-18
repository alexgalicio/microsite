import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { handleError } from "@/lib/utils";
import { EventClickArg } from "@fullcalendar/core/index.js";
import { deleteCalendarEvent } from "@/lib/actions/calendar";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent?: EventClickArg | null;
}

export function CalendarDeleteDialog({
  open,
  onOpenChange,
  selectedEvent,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      if (selectedEvent) {
        const response = await deleteCalendarEvent(selectedEvent.event.id);
        if (response.success) {
          selectedEvent.event.remove();
          onOpenChange(false);
        } else {
          toast.error(response.error);
        }
      }
    } catch (error) {
      toast.error(handleError(error));
      console.error("Delete Announcement Error: ", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>Delete Event</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the event{" "}
            <span className="font-bold">{selectedEvent?.event.title}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            className="w-full sm:w-18"
            onClick={handleDelete}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
