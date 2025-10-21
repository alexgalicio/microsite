"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import {
  deleteFacebookCreds,
  getFormValues,
  submitForm,
} from "@/lib/actions/facebook";
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
import { useRouter } from "next/navigation";
import { PasswordInput } from "../ui/password-input";

const formSchema = z.object({
  page_id: z.string(),
  access_token: z.string(),
});

type FacebookForm = z.infer<typeof formSchema>;

export default function FacebookForm({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FacebookForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      page_id: "",
      access_token: "",
    },
  });

  // load facebook data
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
        toast.success("Facebook settings saved successfully.");
        router.refresh();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function onDelete() {
    setIsDeleteLoading(true);
    try {
      const response = await deleteFacebookCreds(userId);
      if (response.success) {
        toast.success("Facebook settings deleted successfully.");
        form.reset({ page_id: "", access_token: "" });
        router.refresh();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsDeleteLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        id="event-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-[600px]"
      >
        {/* facebook page id */}
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

        {/* access token from graph api */}
        <FormField
          control={form.control}
          name="access_token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Token</FormLabel>
              <FormControl>
                <PasswordInput
                  id="access_token"
                  placeholder="Enter access token"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* submit button */}
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isDirty}
            className="sm:w-20"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>

          {/* delete button */}
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleteLoading || !form.formState.isDirty}
            onClick={onDelete}
            className="sm:w-20"
          >
            {isDeleteLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
