"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Submenu } from "@/lib/schema";
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
import { editSubmenu } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Submenu name is required")
    .refine(
      // must be 3 char long excluding spaces
      (value) => value.replace(/\s+/g, "").length >= 3,
      "Submenu must be at least 3 characters"
    )
    .trim(),
});

type SubmenuForm = z.infer<typeof formSchema>;

interface Props {
  currentRow: Submenu;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmenuActionDialog({ currentRow, open, onOpenChange }: Props) {
  const [isloading, setIsloading] = useState(false);
  const router = useRouter();

  const form = useForm<SubmenuForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: currentRow.title,
    },
  });

  async function onSubmit(values: SubmenuForm) {
    setIsloading(true);
    try {
      await editSubmenu(currentRow.id, values.title);
      toast.success("Submenu updated successfully");
      router.refresh();
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.log("Submenu error: ", error);
      toast.error(handleError(error));
    } finally {
      setIsloading(false);
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
          <DialogTitle>Edit Menu</DialogTitle>
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
                  <FormLabel htmlFor="title">Menu Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter menu title"
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
          <Button type="submit" form="menu-form" disabled={isloading}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
