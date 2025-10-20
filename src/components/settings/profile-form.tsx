"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser, useReverification } from "@clerk/nextjs";
import { useRef, useState } from "react";
import {
  isClerkRuntimeError,
  isReverificationCancelledError,
} from "@clerk/nextjs/errors";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";

const formSchema = z.object({
  profileImg: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
});

type ProfileForm = z.infer<typeof formSchema>;

export default function ProfileForm() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [pendingEmailId, setPendingEmailId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileImg: user?.imageUrl || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
    },
  });

  // use reverification for sensitive actions (from clerk docs)
  const createEmailAddress = useReverification((email: string) =>
    user?.createEmailAddress({ email })
  );

  // use reverification for sensitive actions (from clerk docs)
  const changePrimaryEmail = useReverification((emailAddressId: string) =>
    user?.update({ primaryEmailAddressId: emailAddressId })
  );

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setIsUploadingImage(true);
    try {
      await user?.setProfileImage({ file });
      await user?.reload();
      form.setValue("profileImg", user?.imageUrl || "");
      toast.success("Profile image updated successfully!");
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleRemoveImage() {
    setIsUploadingImage(true);
    try {
      await user?.setProfileImage({ file: null });
      await user?.reload();
      form.setValue("profileImg", "");
      toast.success("Profile image removed successfully!");
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleVerifyEmail() {
    if (!pendingEmailId || !verificationCode) return;

    setIsVerifying(true);
    try {
      // store old email id before making changes
      const oldEmailId = user?.primaryEmailAddress?.id;

      // find email address object
      const emailAddress = user?.emailAddresses.find(
        (ea) => ea.id === pendingEmailId
      );

      if (emailAddress) {
        // verify email with the code
        await emailAddress.attemptVerification({ code: verificationCode });

        // reload user to get updated verification status
        await user?.reload();

        // make the email primary
        await changePrimaryEmail(pendingEmailId);

        // delete old email address if exists
        if (oldEmailId && oldEmailId !== pendingEmailId) {
          const oldEmail = user?.emailAddresses.find(
            (ea) => ea.id === oldEmailId
          );
          if (oldEmail) {
            await oldEmail.destroy();
            console.log("Old email address removed");
          }
        }

        // reload user to reflect changes
        await user?.reload();

        // update form with new email
        form.setValue("email", emailAddress.emailAddress);

        setPendingEmailId(null);
        setVerificationCode("");
        console.log("Email updated successfully!");
      }
    } catch (error) {
      if (isClerkRuntimeError(error) && isReverificationCancelledError(error)) {
        console.error("User cancelled reverification");
      } else {
        toast.error(handleError(error));
      }
    } finally {
      setIsVerifying(false);
    }
  }

  async function onSubmit(values: ProfileForm) {
    setIsLoading(true);
    try {
      // update name
      await user?.update({
        firstName: values.firstName,
        lastName: values.lastName,
      });

      // email update if changed
      const currentEmail = user?.primaryEmailAddress?.emailAddress;
      if (values.email !== currentEmail) {
        // create new email address
        const newEmailAddress = await createEmailAddress(values.email);

        if (newEmailAddress) {
          // send verification code
          await newEmailAddress.prepareVerification({ strategy: "email_code" });
          setPendingEmailId(newEmailAddress.id);
          toast.success("Verification code sent to your new email.");
        }
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      if (isClerkRuntimeError(error) && isReverificationCancelledError(error)) {
        console.warn("User cancelled reverification");
      } else {
        toast.error(handleError(error));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          id="profile-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* profile image */}
          <FormField
            control={form.control}
            name="profileImg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={field.value || user?.imageUrl} />
                      <AvatarFallback>
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    {/* upload and remove button*/}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingImage}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                        {user?.hasImage && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={handleRemoveImage}
                            disabled={isUploadingImage}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <FormDescription className="text-xs">
                        Recommended size 1:1, up to 2MB
                      </FormDescription>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* first name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* last name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter you email"
                    {...field}
                    disabled={!!pendingEmailId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* submit button */}
          <Button
            type="submit"
            form="profile-form"
            disabled={isLoading || !!pendingEmailId || !form.formState.isDirty}
            className="w-full sm:w-30"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </Form>

      {/* email verification section */}
      {pendingEmailId && (
        <div className="border-t pt-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Verify New Email</h3>
            <p className="text-sm text-gray-600 mb-4">
              We&apos;ve sent a verification code to your new email address.
              Enter it below to complete the change.
            </p>
          </div>

          {/* input code */}
          <div className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-2">
                Verification Code
              </label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>

            {/* submit and cancel button */}
            <div className="flex gap-2">
              <Button
                onClick={handleVerifyEmail}
                disabled={isVerifying || !verificationCode}
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPendingEmailId(null);
                  setVerificationCode("");
                  form.setValue(
                    "email",
                    user?.primaryEmailAddress?.emailAddress || ""
                  );
                }}
                disabled={isVerifying}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
