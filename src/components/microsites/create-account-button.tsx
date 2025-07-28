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
import { Plus } from "lucide-react";

const formSchema = z.object({
  menu: z.string().min(1, "Menu is required"),
  submenu: z.string().min(1, "Submenu is required"),
  email: z.email({ message: "Invalid email" }).min(1, "Email is required"),
});

type AccountForm = z.infer<typeof formSchema>;

export default function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [menus, setMenus] = useState<MenuItem[]>([]);

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

  async function onSubmit(values: AccountForm) {
    try {
      setIsLoading(true);
      const result = await createUser(values);
      if (result.success) {
        toast.success("Account created successfully");
        form.reset();
        console.log(result);
      } else {
        console.log("error:", result);
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      console.log(handleError(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
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
                    <FormLabel htmlFor="submenu">submenu</FormLabel>
                    <FormControl>
                      <Input id="submenu" type="text" {...field} />
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
                <span className="font-medium">Note:</span> A password will be
                automatically generated and account details will be sent to the
                provided email address.
              </DialogDescription>

              <Button type="submit" className="w-full" disabled={isLoading}>
                Create Account
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
