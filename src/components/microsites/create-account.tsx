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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { createNewAccount } from "@/lib/actions/create-account";
import { getAllMenu } from "@/lib/actions/menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItem } from "@/lib/types";
import { InfoIcon, Loader2, Plus, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  menu: z.string().min(1, "Please select a menu"),
  submenu: z
    .string()
    .min(3, "Submenu must be at least 3 characters")
    .max(50, "Submenu must be less than 50 characters")
    .transform((str) => str.replace(/\s+/g, " ").trim())
    .refine((value) => value.replace(/\s+/g, "").length >= 3),
  email: z.string().email(),
});

type AccountForm = z.infer<typeof formSchema>;

export default function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
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
      const response = await createNewAccount(values);
      if (response.success) {
        toast.success("Account created successfully");
        form.reset();
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(response.error);
        console.log("Create Account Error:", response.error);
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
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form
            id="account-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
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
                      {menus.length > 0 ? (
                        menus.map((menu) => (
                          <SelectItem key={menu.id} value={menu.id}>
                            {menu.title}
                          </SelectItem>
                        ))
                      ) : (
                        <Link href="/manage-menu">
                          <Button variant="ghost" className="w-full">
                            <PlusCircleIcon className="w-4 h-4 border rounded-full" />
                            Create Menu
                          </Button>
                        </Link>
                      )}
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
          </form>
        </Form>
        <Alert className="border-cyan-600/50 text-cyan-600 dark:border-cyan-600 [&>svg]:text-cyan-600">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle className="line-clamp-none">
            Password will be automatically generated and account details will be
            sent to the provided email address.
          </AlertTitle>
        </Alert>
        <DialogFooter>
          <Button
            type="submit"
            form="account-form"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
