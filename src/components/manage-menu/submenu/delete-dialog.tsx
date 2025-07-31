"use client";

import { Submenu } from "@/lib/schema";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { deleteSubmenu } from "@/lib/actions";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Loader2, OctagonAlertIcon } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Submenu;
}

export function SubmenuDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (value.trim() !== currentRow.title) return;

    try {
      setIsLoading(true);
      const result = await deleteSubmenu(currentRow.id);
      if (result?.error) {
        toast.error(result.error);
      } else if (result.data) {
        toast.success("Submenu deleted successfully");
        onOpenChange(false);
        router.refresh();
      }
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.title || isLoading}
      title={`Confirm deletion of ${currentRow.title}`}
      desc={
        <div className="space-y-4">
          <Alert
            variant="destructive"
            className="bg-destructive/10 dark:bg-destructive/20 border-destructive/50 dark:border-destructive/70"
          >
            <OctagonAlertIcon className="w-4 h-4" />
            <AlertTitle>You cannot recover this menu once deleted</AlertTitle>
            <AlertDescription>
              <p>
                Your menu{" "}
                <strong className="font-medium">{currentRow.title}</strong> and
                all its contents will be permanently deleted.
              </p>
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <p>
              Type &quot;<span className="font-medium">{currentRow.title}</span>
              &quot; to confirm.
            </p>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type in name of submenu"
            />
          </div>
        </div>
      }
      confirmText={
        isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"
      }
      destructive
    />
  );
}
