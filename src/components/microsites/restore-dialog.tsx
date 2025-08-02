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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { restoreSite } from "@/lib/actions/site";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Site;
}

export function RestoreSiteDialog({ open, onOpenChange, currentRow }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await restoreSite(currentRow.id);
      if (response.success) {
        console.log(`Site ${currentRow.title} restored successfully`);
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(handleError(error));
      console.error("Restore Site Dialog: ", error);
    } finally {
      setIsLoading(false);
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
            <DialogTitle>Restore Site</DialogTitle>
            <DialogDescription>
              You are about to restore{" "}
              <span className="font-medium">{currentRow.title}</span>. This will
              make the site publicly accessible again.
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
                "Restore"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
