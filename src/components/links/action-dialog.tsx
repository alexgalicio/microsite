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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  addNewLink,
  createCategory,
  createTo,
  editLink,
  getAllCategories,
  getAllTo,
} from "@/lib/actions/links";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Combobox, { ComboboxOptions } from "./combo-box-create";

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
  category: z.string().min(1, "This field is required"),
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

  // state for options
  const [categories, setCategories] = useState<ComboboxOptions[]>([]);

  // loading states
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [audiencesLoading, setAudiencesLoading] = useState(true);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const form = useForm<LinkForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: currentRow.title,
          url: currentRow.url,
          category: currentRow.link_category.id,
          description: currentRow.description || "",
          isEdit,
        }
      : {
          title: "",
          url: "",
          category: "",
          description: "",
          isEdit,
        },
  });

  useEffect(() => {
    if (open) {
      fetchAllOptions();
    }
  }, [open]);

  async function fetchAllOptions() {
    try {
      setCategoriesLoading(true);
      setAudiencesLoading(true);

      const [catRes, toRes] = await Promise.all([
        getAllCategories(),
        getAllTo(),
      ]);

      if (catRes.success) {
        setCategories(
          catRes.data.map((cat) => ({
            id: cat.id,
            title: cat.title,
          }))
        );
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      toast.error("Failed to load options");
      console.error(error);
    } finally {
      setCategoriesLoading(false);
      setAudiencesLoading(false);
    }
  }

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

  function handleCategorySelect(option: ComboboxOptions) {
    form.setValue("category", option.id);
  }

  async function handleCreateCategory(label: string) {
    try {
      setIsCreatingCategory(true);
      const result = await createCategory(label);
      if (result.success) {
        const newCategory = {
          id: result.data?.id,
          title: result.data?.title,
        };
        setCategories((prev) => [...prev, newCategory]);
        handleCategorySelect(newCategory);
        toast.success("Category created successfully");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsCreatingCategory(false);
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
              name="category"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Combobox
                        options={categories}
                        placeholder="Please select an option"
                        selected={field.value}
                        disabled={categoriesLoading}
                        onChange={handleCategorySelect}
                        onCreate={handleCreateCategory}
                      />
                      {(categoriesLoading || isCreatingCategory) && (
                        <div className="absolute right-8 top-1/2 -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      )}
                    </div>
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
                      placeholder="Enter description"
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
