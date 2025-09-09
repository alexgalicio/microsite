"use client";

import RichTextEditor from "@/components/announcement/rich-text-editor";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn, handleError } from "@/lib/utils";
import { ChevronLeft, Loader2 } from "lucide-react";
import { NotFoundError } from "@/components/not-found";
import { format } from "date-fns";
import SubdomainHeader from "@/components/subdomain-header";
import { useSite } from "@/components/subdomain-provider";
import { useEffect, useState, use } from "react";
import { getAnnouncementBySlug } from "@/lib/actions/announcement";
import { Announcements } from "@/lib/types";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const site = useSite();
  const [data, setData] = useState<Announcements | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAnnouncementBySlug(slug);
        if (response.success) {
          setData(response.data);
        } else {
          setError(handleError(response.error));
        }
      } catch (error) {
        setError(handleError(error));
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [slug]);

  return (
    <>
      <SubdomainHeader title={site.title} subdomain={site.subdomain} />
      <div className="max-w-3xl px-4 mx-auto pt-10 mt-20 mb-10">
        <div className="">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : error || !data ? (
            <NotFoundError />
          ) : (
            <>
              <h1 className="text-4xl font-bold">{data.title}</h1>
              <div className="flex text-sm opacity-40 gap-2 mt-4 mb-8">
                <p>by {data.author}</p>
                <span>•</span>
                <p>{format(new Date(data.created_at), "MMMM d, yyyy")}</p>
              </div>
              <div className="mx-auto">
                {data.cover && (
                  <Image
                    src={data.cover}
                    alt={data.title}
                    width={800}
                    height={400}
                    className="mb-8"
                  />
                )}
                <RichTextEditor content={data.content} editable={false} />
              </div>
              <div className="flex justify-center mt-10">
                <Link
                  href="/announcements"
                  className={cn(buttonVariants({ variant: "ghost" }))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Go back
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
