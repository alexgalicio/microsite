"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import {
  getConfiguration,
  uploadLogo,
  upsertPageConfigurations,
} from "@/lib/actions/settings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleError } from "@/lib/utils";

const formSchema = z.object({
  logo: z.string(),
  pageTitle: z.string(),
  logoWidth: z
    .number()
    .min(50, "Width must be at least 50px")
    .max(500, "Width cannot exceed 500px"),
  logoHeight: z
    .number()
    .min(50, "Height must be at least 50px")
    .max(500, "Height cannot exceed 500px"),
});

type ConfigureForm = z.infer<typeof formSchema>;

export default function ConfigureForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ConfigureForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo: "",
      pageTitle: "",
      logoWidth: 50,
      logoHeight: 50,
    },
  });

  // load existing config
  useEffect(() => {
    async function fetchConfig() {
      const config = await getConfiguration();
      if (config) {
        form.setValue("pageTitle", config.page_title || "");
        form.setValue("logo", config.logo || "");
        form.setValue("logoWidth", config.logo_width || 50);
        form.setValue("logoHeight", config.logo_height || 50);
        setCurrentFilePath(config.logo || null);
      }
    }
    fetchConfig();
  }, [form]);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB.");
      return;
    }

    setUploading(true);
    try {
      const response = await uploadLogo(file, currentFilePath!);
      if (response.success && response.data) {
        form.setValue("logo", response.data);
        setCurrentFilePath(response.data.split("/assets/")[1]);
        toast.success("Logo uploaded successfully.");
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setUploading(false);
    }
  }

  function handleNumberInput(
    e: React.ChangeEvent<HTMLInputElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: any
  ) {
    const value = e.target.value;

    // allow empty input for deletion
    if (value === "") {
      field.onChange("");
      return;
    }

    // only allow numbers
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      return; // dont update if not number
    }

    // limit to 500 only
    const limitedValue = Math.min(numValue, 500);
    field.onChange(limitedValue);
  }

  async function onSubmit(values: ConfigureForm) {
    setIsLoading(true);
    try {
      const response = await upsertPageConfigurations(
        values.pageTitle,
        values.logoWidth,
        values.logoHeight
      );
      if (response.success) {
        toast.success("Configurations saved successfully.");
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

  // for live preview
  const logoWidth = form.watch("logoWidth") || 50;
  const logoHeight = form.watch("logoHeight") || 50;

  return (
    <Form {...form}>
      <form
        id="configure-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* logo */}
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              {/* logo preview */}
              <div className="flex flex-col items-start gap-2">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="Logo Preview"
                    width={logoWidth}
                    height={logoHeight}
                    className="rounded-md border"
                  />
                ) : (
                  <div
                    className="border rounded-md flex items-center justify-center text-gray-400 text-sm"
                    style={{
                      width: logoWidth,
                      height: logoHeight,
                    }}
                  >
                    No logo
                  </div>
                )}

                <div className="text-xs text-gray-500 text-center">
                  Preview: {logoWidth}×{logoHeight}px
                </div>

                {/* logo upload button */}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    onClick={() =>
                      document.getElementById("logo-input")?.click()
                    }
                    className="flex items-center gap-2 w-full sm:w-34"
                  >
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </>
                  </Button>
                  <input
                    id="logo-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </div>
              </div>
              <FormDescription>Upload your landing page logo</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* logo width */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="logoWidth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo Width (px)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter width"
                    autoComplete="off"
                    value={field.value === undefined ? "" : field.value}
                    onChange={(e) => handleNumberInput(e, field)}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        field.onChange(50);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>Width in pixels (50-500)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* logo height */}
          <FormField
            control={form.control}
            name="logoHeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo Height (px)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter height"
                    autoComplete="off"
                    value={field.value === undefined ? "" : field.value}
                    onChange={(e) => handleNumberInput(e, field)}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        field.onChange(50);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>Height in pixels (50-500)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* page title */}
        <FormField
          control={form.control}
          name="pageTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter page title"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This title appears on your website&apos;s landing page header
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* submit button */}
        <Button
          type="submit"
          form="configure-form"
          disabled={isLoading || !form.formState.isDirty}
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
  );
}
