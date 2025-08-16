"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Menu } from "@/lib/schema";
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
import { createNewMenu, editMenu } from "@/lib/actions/menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Menu must be at least 3 characters")
    .max(50, "Menu must be less than 50 characters")
    .transform((str) => str.replace(/\s+/g, " ").trim())
    .refine((value) => value.replace(/\s+/g, "").length >= 3),
  isEdit: z.boolean(),
});

type MenuForm = z.infer<typeof formSchema>;

interface Props {
  currentRow?: Menu;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MenuActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<MenuForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: currentRow.title,
          isEdit,
        }
      : {
          title: "",
          isEdit,
        },
  });

  async function onSubmit(values: MenuForm) {
    setIsLoading(true);
    try {
      if (isEdit && currentRow) {
        const editRes = await editMenu(currentRow.id, values.title);
        if (editRes.success) {
          toast.success("Menu updated successfully");
          router.refresh();
        } else {
          toast.error(editRes.error);
        }
      } else {
        const addRes = await createNewMenu(values.title);
        if (addRes.success) {
          toast.success("Menu added successfully");
          router.refresh();
        } else {
          toast.error(addRes.error);
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
          <DialogTitle>{isEdit ? "Edit Menu" : "Create New Menu"}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form
            id="menu-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="title">Menu</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Enter menu name"
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
            form="menu-form"
            className="w-full sm:w-30"
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
