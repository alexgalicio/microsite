import { Site } from "@/lib/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { archiveSite } from "@/lib/actions";
import { useRouter } from "next/navigation";

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
      const result = await archiveSite(currentRow.id);
      if (result.error) {
        toast.error(result.error);
      } else if (result.data) {
        console.log(`Site ${currentRow.title} archived successfully.`);
        router.refresh();
      }
    } catch (error) {
      toast.error(handleError(error));
      console.error("Failed to archive site:", error);
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
            <DialogDescription>
              This will archive the selected site and move its thumbnail off
              your sites tab. You can restore it back to your sites tab at any
              time
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="w-20" disabled={isLoading}>
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
