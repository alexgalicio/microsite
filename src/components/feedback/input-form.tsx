"use client";

import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { submitForm } from "@/lib/actions/notification";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name too long")
    .transform((str) => str.replace(/\s+/g, " ").trim())
    .refine((value) => value.replace(/\s+/g, "").length >= 3),
  email: z.string().email(),
  message: z
    .string()
    .min(3, "Message must be at least 3 characters")
    .refine((value) => value.replace(/\s+/g, "").length >= 3),
});

type ContactForm = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactForm) {
    setIsLoading(true);
    try {
      const response = await submitForm(values);
      if (response.success) {
        toast.success("submitted");
        form.reset();
      } else {
        console.error(response.error);
      }
    } catch (error) {
      toast.error(handleError(error));
      console.error("Contact Form Error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        id="event-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter name</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder="Enter name"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  placeholder="Enter email"
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
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mesage</FormLabel>
              <FormControl>
                <Textarea placeholder="Type your message here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}
