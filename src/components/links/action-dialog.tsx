"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Links } from "@/lib/schema";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { addNewLink, editLink } from "@/lib/actions/links";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be 100 characters or fewer")
    .transform((str) => str.replace(/\s+/g, " ").trim())
    .refine((value) => value.replace(/\s+/g, "").length >= 3),
  url: z
    .string()
    .url("Invalid URL format")
    .regex(/^\S+$/, "Invalid URL format"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(200, "Description must be 200 characters or fewer")
    .transform((str) => str.replace(/\s+/g, " ").trim())
    .refine((value) => value.replace(/\s+/g, "").length >= 3),
  isEdit: z.boolean(),
});

type LinkForm = z.infer<typeof formSchema>;

interface Props {
  currentRow?: Links;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LinkForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: currentRow.title,
          url: currentRow.url,
          description: currentRow.description || "",
          isEdit,
        }
      : {
          title: "",
          url: "",
          description: "",
          isEdit,
        },
  });

  async function onSubmit(values: LinkForm) {
    setIsLoading(true);
    try {
      if (isEdit && currentRow) {
        const editRes = await editLink(currentRow.id, values);
        if (editRes.success) {
          toast.success("Link updated successfully.");
          router.refresh();
        } else {
          toast.error(editRes.error);
        }
      } else {
        const createRes = await addNewLink(values);
        if (createRes.success) {
          toast.success(`${values.url} added successfully.`);
          router.refresh();
        } else {
          toast.error(createRes.error);
        }
      }
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(handleError(error));
      console.error("Link Action Dialog Error: ", error);
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
          <DialogTitle>{isEdit ? "Edit Link" : "Add New Link"}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form
            id="link-form"
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
                      placeholder="Enter link title"
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
              name="url"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="url">URL</FormLabel>
                  <FormControl>
                    <Input
                      id="url"
                      placeholder="Eg. https://microsite.com"
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
              name="description"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter brief description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormDescription className="break-all">
              Note: You can view all the announcements in https://[yourDomain].
              {process.env.NEXT_PUBLIC_ROOT_DOMAIN}/announcements
            </FormDescription>
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="submit"
            form="link-form"
            className="w-full sm:w-30"
            disabled={isLoading}
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
