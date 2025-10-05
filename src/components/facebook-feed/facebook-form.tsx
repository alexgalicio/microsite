"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { getFormValues, submitForm } from "@/lib/actions/facebook";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  page_id: z.string(),
  access_token: z.string(),
});

type FacebookForm = z.infer<typeof formSchema>;

export default function FacebookForm({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const router = useRouter();

  const form = useForm<FacebookForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      page_id: "",
      access_token: "",
    },
  });

  useEffect(() => {
    async function loadValues() {
      const saved = await getFormValues(userId);
      if (saved) {
        form.reset(saved);
      }
    }
    if (userId) loadValues();
  }, [form, userId]);

  async function onSubmit(values: FacebookForm) {
    setIsLoading(true);
    try {
      const response = await submitForm({ ...values, user_id: userId });
      if (response.success) {
        toast.success("Saved successfully!");
        router.refresh();
      } else {
        console.error(response.error);
      }
    } catch (error) {
      toast.error(handleError(error));
      console.error("Facebook Form Error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        id="event-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-[600px]"
      >
        <FormField
          control={form.control}
          name="page_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page ID</FormLabel>
              <FormControl>
                <Input
                  id="page_id"
                  placeholder="Enter page id"
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
          name="access_token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Token</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={isView ? "text" : "password"}
                    id="access_token"
                    placeholder="Enter access token"
                    className="pr-10"
                    autoComplete="off"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setIsView(!isView)}
                  >
                    {isView ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading || !form.formState.isDirty}
          className="sm:w-20"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
