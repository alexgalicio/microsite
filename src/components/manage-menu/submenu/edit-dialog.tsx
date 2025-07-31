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
import { useEffect, useState } from "react";
import { editSubmenu, getAllMenu } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { MenuItem } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  menu: z.string().min(1, "Menu is required"),
});

type SubmenuForm = z.infer<typeof formSchema>;

interface Props {
  currentRow: Submenu;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmenuActionDialog({ currentRow, open, onOpenChange }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const menuData = await getAllMenu();
        setMenus(menuData);
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };

    fetchMenus();
  }, []);

  const form = useForm<SubmenuForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: currentRow.title,
      menu: currentRow.menu_id,
    },
  });

  async function onSubmit(values: SubmenuForm) {
    setIsLoading(true);
    try {
      const result = await editSubmenu(
        currentRow.id,
        values.title,
        values.menu
      );
      if (result.error) {
        toast.error(result.error);
      } else if (result.data) {
        toast.success("Submenu updated successfully");
        router.refresh();
      }
      
      form.reset();
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.log("Submenu error: ", error);
      toast.error(handleError(error));
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
          <DialogTitle>Edit Submenu</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form
            id="submenu-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="title">Submenu</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter submenu name"
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
              name="menu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change menu</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a menu item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {menus.map((menu) => (
                        <SelectItem key={menu.id} value={menu.id}>
                          {menu.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="submenu-form"
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
