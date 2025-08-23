import { Site } from "@/lib/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { archiveSite } from "@/lib/actions/site";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Site;
}

export function ArchiveSiteDialog({ open, onOpenChange, currentRow }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await archiveSite(currentRow.id);
      if (response.success) {
        toast.success(`Microsite "${currentRow.title}" archived successfully.`);
        router.refresh();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(handleError(error));
      console.error("Archive Site Dialog Error:", error);
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state);
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Archive Site</DialogTitle>
            <DialogDescription />
            <Alert className="text-left">
              <Info />
              <AlertTitle>
                You are about to archive &quot;{currentRow.title}&quot;. This action will:
              </AlertTitle>
              <AlertDescription>
                <ul className="list-inside list-disc text-sm">
                  <li>Make the site inaccessible to the public</li>
                  <li>Preserve all data (nothing will be deleted)</li>
                  <li>Allow you to restore it at any time</li>
                </ul>
              </AlertDescription>
            </Alert>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="w-full sm:w-20" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Archive"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
