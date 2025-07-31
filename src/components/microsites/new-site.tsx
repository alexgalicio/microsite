"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createSite } from "@/lib/actions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleError } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  subdomain: z
    .string()
    .min(1, "Subdomain is required")
    .max(50)
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Subdomain can only contain letters, numbers, and hyphens",
    }),
});

type FormData = z.infer<typeof formSchema>;

export default function NewMicrosite() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subdomain: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      const result = await createSite(values.title, values.subdomain);
      if (result.error) {
        toast.error(result.error);
      } else if (result.data) {
        toast.success(`Success ${values.title} has been created`);
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      toast.error(handleError(error));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><Plus size={18} /> <span>New Site</span></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Site</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form
            id="microsite-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input id="title" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subdomain</FormLabel>
                  <FormControl>
                    <Input id="subdomain" autoComplete="off" {...field} />
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
            form="microsite-form"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Create Microsite"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
