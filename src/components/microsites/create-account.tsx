"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { handleError } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createUser, getAllMenu } from "@/lib/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItem } from "@/lib/types";
import { Loader2, Plus } from "lucide-react";

const formSchema = z.object({
  menu: z.string().min(1, "Menu is required"),
  submenu: z
    .string()
    .min(1, "Submenu is required")
    .refine(
      // must be 3 char long excluding spaces
      (value) => value.replace(/\s+/g, "").length >= 3,
      "Submenu must be at least 3 characters"
    )
    .trim(),
  email: z.email({ message: "Invalid email address" }).min(1, "Email is required"),
});

type AccountForm = z.infer<typeof formSchema>;

export default function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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

  const form = useForm<AccountForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      menu: "",
      submenu: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  async function onSubmit(values: AccountForm) {
    setIsLoading(true);
    try {
      const result = await createUser(values);
      if (result.success) {
        toast.success("Account created successfully");
        form.reset();
        setIsOpen(false);
        console.log(result); // TODO: email user their details
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.log(handleError(error));
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus size={18} /> <span>Create Account</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="menu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Menu</FormLabel>
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
              <FormField
                control={form.control}
                name="submenu"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="submenu">Submenu</FormLabel>
                    <FormControl>
                      <Input id="submenu" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogDescription className="p-4 text-sm text-blue-800 rounded-lg bg-blue-50">
                <span className="font-medium">Note:</span> Password will be
                automatically generated and account details will be sent to the
                provided email address.
              </DialogDescription>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
