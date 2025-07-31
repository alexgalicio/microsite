"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Site } from "@/lib/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createSite, editSite } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  subdomain: z
    .string()
    .min(1, "Subdomain is required")
    .max(50)
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Subdomain can only contain letters, numbers, and hyphens",
    }),
  isEdit: z.boolean(),
});

type SiteForm = z.infer<typeof formSchema>;

interface Props {
  currentRow?: Site;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SiteActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SiteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: currentRow.title,
          subdomain: currentRow.subdomain,
          isEdit,
        }
      : {
          title: "",
          subdomain: "",
          isEdit,
        },
  });

  async function onSubmit(values: SiteForm) {
    setIsLoading(true);
    try {
      if (isEdit && currentRow) {
        const editRes = await editSite(currentRow.id, values.title, values.subdomain);
        if (editRes.error) {
          toast.error(editRes.error);
        } else if (editRes.data) {
          toast.success("Site updated successfully");
          router.refresh();
        }
      } else {
        const createRes = await createSite(values.title, values.subdomain);
        if (createRes.error) {
          toast.error(createRes.error);
        } else if (createRes.data) {
          toast.success(`Site ${values.title} has been created`);
          router.refresh();
        }
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(handleError(error));
      console.error("Menu Action Dialog Error: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{isEdit ? "Edit Site" : "Add New Site"}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form
            id="site-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Enter site title"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="subdomain">Subdomain</FormLabel>
                  <FormControl>
                    <Input
                      id="subdomain"
                      placeholder="Enter subdomain"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="site-form"
            className="w-30"
            disabled={isLoading || !form.formState.isDirty}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
