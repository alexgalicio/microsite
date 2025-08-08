import Header from "@/components/announcement/header";
import RichTextEditor from "@/components/announcement/rich-text-editor";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { createServerSupabaseClient } from "@/utils/server";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("slug", slug);

  if (error || !data) {
    return <div>Site not found</div>;
  }

  return (
    <div className="mx-auto px-5 max-w-6xl">
      <Header />

      <div className="max-w-3xl mx-auto">
        <div className="mb-10 mt-8 lg:mt-20">
          <h1 className="text-4xl font-bold">{data[0].title}</h1>
          <div className="flex text-sm opacity-40 gap-2 mt-4 mb-8">
            <p>by {data[0].author}</p>
            <span>•</span>
            <time dateTime={data[0].created_at}>
              {formatDate(data[0].created_at)}
            </time>
          </div>
          <div className="mx-auto">
            {data[0].cover && (
              <Image
                src={data[0].cover}
                alt={data[0].title}
                width={800}
                height={400}
                className="mb-8"
              />
            )}
            <RichTextEditor content={data[0].content} editable={false} />
          </div>
        </div>
      </div>

      <section className="mt-8 md:mt-16 mb-12">
        <div className="flex justify-center mt-8">
          <Link
            href="/announcement"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <ChevronLeft className="h-4 w-4" />
            See all
          </Link>
        </div>
      </section>
    </div>
  );
}
