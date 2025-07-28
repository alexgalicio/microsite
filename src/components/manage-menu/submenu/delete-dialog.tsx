"use client";

import { Submenu } from "@/lib/schema";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {  deleteSubmenu } from "@/lib/actions";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
      await deleteSubmenu(currentRow.id);
      toast.success("Submenu deleted successfully");
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
            <AlertTitle>You cannot recover this submenu once deleted.</AlertTitle>
            <AlertDescription>All submenu data will be lost.</AlertDescription>
          </Alert>

          <p>
            Your submenu {currentRow.title} and all its contents will be
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
              placeholder="Type in name of submenu"
            />
          </div>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}
