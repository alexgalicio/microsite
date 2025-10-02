"use client";

import { Links } from "@/lib/schema";
import { handleError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, OctagonAlertIcon } from "lucide-react";
import { deleteLink, removeImage } from "@/lib/actions/links";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Links;
}

export function LinkDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);
    try {
      if (currentRow.image) {
        await removeImage(currentRow.image);
      }
      
      const response = await deleteLink(currentRow.id);
      if (response?.success) {
        toast.success("Link deleted successfully.");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(handleError(error));
      console.error("Link Delete Dialog Error: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      title={`Confirm deletion of "${currentRow.title}"`}
      desc={
        <div className="space-y-4">
          <Alert
            variant="destructive"
            className="bg-destructive/10 dark:bg-destructive/20 border-destructive/50 dark:border-destructive/70"
          >
            <OctagonAlertIcon className="w-4 h-4" />
            <AlertTitle>You cannot recover this link once deleted</AlertTitle>
            <AlertDescription>
              <p>
                The link{" "}
                <strong className="font-medium">{currentRow.url}</strong> will be permanently deleted. This action cannot
                be undone.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={
        isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"
      }
      destructive
    />
  );
}
