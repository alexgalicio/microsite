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
import { unpublishSite } from "@/lib/actions/site";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Site;
}

export function UnpublishSiteDialog({ open, onOpenChange, currentRow }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await unpublishSite(currentRow.id);
      if (response.success) {
        toast.success(
          `Microsite "${currentRow.title}" unpublished successfully.`
        );
        router.refresh();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(handleError(error));
      console.error("Unpublished Site Dialog Error:", error);
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
            <DialogTitle>Unpublish Site</DialogTitle>
            <DialogDescription>
              You are about to unpublish &quot;
              <span className="font-medium">{currentRow.title}</span>&quot;.
              This will make the site inaccessible to public.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-full sm:w-20"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "OK"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
