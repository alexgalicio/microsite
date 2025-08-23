import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { handleError } from "@/lib/utils";
import { deleteAnnouncement } from "@/lib/actions/announcement";

export default function DeleteAnnouncementDialog({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteAnnouncement(id);
      if (response.success) {
        toast.success("Announcement deleted successfully.");
        setIsOpen(false);
        router.push("/announcements");
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(handleError(error));
      console.error("Delete Announcement Error: ", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone and will permanently delete the
            announcement.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            className="w-18"
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
