"use client";

import { Chunks } from "@/lib/schema";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Loader2, OctagonAlertIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteFile } from "@/lib/actions/chatbot";

export default function DeleteDialog({ chunks }: { chunks: Chunks }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (value.trim() !== chunks.filename) return;

    setIsLoading(true);
    try {
      const response = await deleteFile(chunks.filename);
      if (response.success) {
        toast.success("File deleted successfully.");
        setValue("");
        setIsDeleteDialogOpen(false);
        router.refresh();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(handleError(error));
      console.error("Chatbot Delete Dialog Error: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsDeleteDialogOpen(true)}
        className="h-8 w-8 text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setValue("");
        }}
        handleConfirm={handleDelete}
        disabled={value.trim() !== chunks.filename || isLoading}
        title={"Delete File"}
        desc={
          <div className="space-y-4">
            <Alert
              variant="destructive"
              className="bg-destructive/10 dark:bg-destructive/20 border-destructive/50 dark:border-destructive/70"
            >
              <OctagonAlertIcon className="w-4 h-4" />
              <AlertTitle>You cannot recover this file once deleted</AlertTitle>
              <AlertDescription>
                <p>
                  Deleting{" "}
                  <strong className="font-medium">{chunks.filename}</strong>{" "}
                  will permanently remove this file and all of its data from the
                  chatbot&apos;s knowledge base.
                </p>
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <p>
                Type &quot;
                <span className="font-medium">{chunks.filename}</span>
                &quot; to confirm.
              </p>
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Type in name of file"
              />
            </div>
          </div>
        }
        confirmText={
          isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"
        }
        destructive
      />
    </>
  );
}
