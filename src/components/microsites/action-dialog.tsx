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
import {
  removeBgImage,
  createNewSite,
  editSite,
  uploadBgImage,
} from "@/lib/actions/site";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(30, "Title must be less than 30 characters")
    .transform((str) => str.replace(/\s+/g, " ").trim())
    .refine((value) => value.replace(/\s+/g, "").length >= 3),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(50, "Subdomain must be less than 50 characters")
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Subdomain can only contain letters, numbers, and hyphens",
    })
    .transform((str) => str.replace(/\s+/g, " ").trim())
    .refine((value) => value.replace(/\s+/g, "").length >= 3),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .transform((str) => str.replace(/\s+/g, " ").trim()),
  bg_image: z.string(),
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  const form = useForm<SiteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: currentRow.title,
          subdomain: currentRow.subdomain,
          description: currentRow.description || "",
          bg_image: currentRow.bg_image || "",
          isEdit,
        }
      : {
          title: "",
          subdomain: "",
          description: "",
          bg_image: "",
          isEdit,
        },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        event.target.value = "";
        setImageFile(null);
        form.setValue("bg_image", "");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        event.target.value = "";
        setImageFile(null);
        form.setValue("bg_image", "");
        return;
      }

      setImageFile(file);
    }
  };

  async function onSubmit(values: SiteForm) {
    setIsLoading(true);
    try {
      let imageUrl = values.bg_image;

      if (imageFile) {
        if (isEdit && currentRow?.bg_image) {
          await removeBgImage(currentRow.bg_image).catch((error) => {
            console.error("Failed to delete old image:", error);
            // continue even if deletion fails to not block the update
          });
        }

        // upload the new image
        const uploadRes = await uploadBgImage(imageFile);
        if (uploadRes.success) {
          imageUrl = uploadRes.data ?? "";
        } else {
          imageUrl = "";
          console.error("Upload Image Error: ", uploadRes.error);
        }
      }

      const updatedValues = {
        ...values,
        bg_image: imageUrl,
      };

      if (isEdit && currentRow) {
        const editRes = await editSite(currentRow.id, updatedValues);
        if (editRes.success) {
          toast.success("Site updated successfully");
          router.refresh();
        } else {
          toast.error(editRes.error);
        }
      } else {
        const createRes = await createNewSite(updatedValues);
        if (createRes.success) {
          toast.success(`Site ${values.title} has been created`);
          router.refresh();
        } else {
          toast.error(createRes.error);
        }
      }
      form.reset();
      setImageFile(null);
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
        setImageFile(null);
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{isEdit ? "Edit Site" : "Create New Site"}</DialogTitle>
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
                      placeholder="Enter site subdomain"
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
                    <Input
                      id="description"
                      placeholder="Enter site description"
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
              name="bg_image"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="bg_image">Background Image</FormLabel>
                  <FormControl>
                    <Input
                      id="bg_image"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        handleImageChange(event);
                        field.onChange("");
                      }}
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
