"use client";

import { useState } from "react";
import { z } from "zod";
import { useUser, useReverification } from "@clerk/nextjs";
import {
  isClerkRuntimeError,
  isReverificationCancelledError,
} from "@clerk/nextjs/errors";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "../ui/password-input";

// password validation
const formSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof formSchema>;

export default function ChangePasswordForm() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // use reverification for sensitive actions (clerk)
  const changePassword = useReverification(
    async (currentPassword: string, newPassword: string) => {
      await user?.updatePassword({ currentPassword, newPassword });
    }
  );

  const form = useForm<PasswordForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: PasswordForm) {
    setIsLoading(true);
    try {
      await changePassword(values.currentPassword, values.newPassword);
      toast.success("Password changed successfully!");
    } catch (error) {
      if (isClerkRuntimeError(error) && isReverificationCancelledError(error)) {
        console.warn("User cancelled reverification.");
      } else {
        toast.error(handleError(error));
      }
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* current password */}
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter current password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* new password */}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Enter new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* confirm password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Confirm new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* submit button */}
        <Button type="submit" disabled={isLoading} className="w-full sm:w-36">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Change Password"
          )}
        </Button>
      </form>
    </Form>
  );
}
