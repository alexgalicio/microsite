"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createNewAnnouncement,
  editAnnouncement,
  removeCoverImage,
  uploadCoverImage,
} from "@/lib/actions/announcement";
import { handleError } from "@/lib/utils";
import { Announcements } from "@/lib/types";
import DeleteAnnouncementDialog from "./delete-dialog";
import RichTextEditor from "./rich-text-editor";

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .refine(
      (value) => value.replace(/\s+/g, "").length >= 3,
      "Title must be at least 3 characters excluding spaces"
    )
    .trim(),
  author: z
    .string()
    .min(3, "Author name must be at least 3 characters")
    .max(50, "Author name must be less than 50 characters")
    .refine(
      (value) => value.replace(/\s+/g, "").length >= 3,
      "Author name must be at least 3 characters excluding spaces"
    )
    .trim(),
  content: z.string().min(1, "Content is required"),
  cover: z.string(),
});

type AnnouncementForm = z.infer<typeof formSchema>;

export default function AnnouncementForm({
  initialData,
  pageTitle,
}: {
  initialData: Announcements | null;
  pageTitle: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  const isEditing = !!initialData;

  const defaultValues = {
    title: initialData?.title || "",
    author: initialData?.author || "",
    cover: initialData?.cover || "",
    content: initialData?.content || "",
  };

  const form = useForm<AnnouncementForm>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  async function onSubmit(values: AnnouncementForm) {
    setIsLoading(true);
    try {
      let imageUrl = values.cover;

      if (imageFile) {
        // only try to remove old image if editing
        if (isEditing && initialData?.cover) {
          await removeCoverImage(initialData.cover).catch((error) => {
            console.error("Failed to delete old image:", error);
            // continue even if deletion fails
          });
        }

        // upload the new image
        const uploadRes = await uploadCoverImage(imageFile);
        if (uploadRes.success) {
          imageUrl = uploadRes.data ?? "";
        } else {
          imageUrl = "";
          console.error("Upload Image Error: ", uploadRes.error);
        }
      }

      const updatedValues = {
        ...values,
        cover: imageUrl,
      };

      if (isEditing) {
        const editRes = await editAnnouncement(initialData.id, updatedValues);
        if (editRes.success) {
          toast.success("Announcement updated successfully");
          router.push("/announcements");
        } else {
          toast.error(editRes.error);
        }
      } else {
        const response = await createNewAnnouncement(updatedValues);
        if (response.success) {
          toast.success("Announcement published successfully");
          router.push("/announcements");
        } else {
          toast.error(response.error);
        }
      }
    } catch (error) {
      toast.error(handleError(error));
      console.error("Announcement Form Error: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        event.target.value = "";
        setImageFile(null);
        form.setValue("cover", "");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        event.target.value = "";
        setImageFile(null);
        form.setValue("cover", "");
        return;
      }

      setImageFile(file);
    }
  };

  return (
    <Form {...form}>
      <form
        id="announcement-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormLabel className="text-2xl font-bold tracking-tight">
          {pageTitle}
        </FormLabel>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input
                  id="title"
                  placeholder="Enter announcement title"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="author">Author</FormLabel>
                <FormControl>
                  <Input
                    id="author"
                    placeholder="Enter author name"
                    autoComplete="author"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cover"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel htmlFor="cover">Cover Image</FormLabel>
                <FormControl>
                  <Input
                    id="cover"
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
        </div>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2">
          <Button type="submit" className="w-20" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isEditing ? (
              "Update"
            ) : (
              "Add"
            )}
          </Button>

          {isEditing && initialData && (
            <DeleteAnnouncementDialog id={initialData.id} />
          )}
        </div>
      </form>
    </Form>
  );
}
