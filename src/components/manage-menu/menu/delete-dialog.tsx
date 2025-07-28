"use client";

import { Menu } from "@/lib/schema";
import { useState } from "react";
import { ConfirmDialog } from "../../confirm-dialog";
import { Input } from "../../ui/input";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import { deleteMenu } from "@/lib/actions";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Menu;
}

export function MenuDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (value.trim() !== currentRow.title) return;

    try {
      setIsLoading(true);
      await deleteMenu(currentRow.id);
       toast.success("Menu deleted successfully");
      onOpenChange(false);
      router.refresh();
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
          <Alert variant="destructive">
            <AlertTitle>You cannot recover this menu once deleted.</AlertTitle>
            <AlertDescription>All menu data will be lost.</AlertDescription>
          </Alert>

          <p>
            Your menu {currentRow.title} and all its contents will be
            permanently deleted.
          </p>

          <div className="space-y-2">
            <p>
              Type <span className="font-medium">{currentRow.title}</span> to
              confirm.
            </p>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type in name of menu"
            />
          </div>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}
