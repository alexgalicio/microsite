"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface FbPost {
  id: string;
  message?: string;
  full_picture?: string;
  created_time: string;
  permalink_url: string;
}

export default function FacebookFeed({
  siteId,
  onDataStatusChange,
}: {
  siteId: string;
  onDataStatusChange?: (hasData: boolean) => void;
}) {
  const [posts, setPosts] = useState<FbPost[]>([]);
  const [pageName, setPageName] = useState<string>("");
  const [pagePicture, setPagePicture] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(10);

  useEffect(() => {
    if (!siteId) return;

    fetch(`/api/facebook?siteId=${siteId}`)
      .then((res) => res.json())
      .then((data) => {
        setPageName(data.name);
        setPagePicture(data.picture?.data?.url || "");

        const posts = data.posts?.data || [];

        //  latest to oldest
        const sorted = posts.sort(
          (a: FbPost, b: FbPost) =>
            new Date(b.created_time).getTime() -
            new Date(a.created_time).getTime()
        );

        setPosts(sorted);

        onDataStatusChange?.(sorted.length > 0);
      })
      .catch(() => {
        onDataStatusChange?.(false);
      });
  }, [siteId, onDataStatusChange]);

  if (posts.length === 0) {
    return null;
  }

  const displayedPosts = posts.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <>
      <h2 className="text-3xl font-semibold text-foreground mb-6">
        Facebook Feed
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {displayedPosts.map((post) => (
          <Link
            key={post.id}
            href={post.permalink_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="w-full shadow-none py-0 gap-0 overflow-hidden hover:shadow-md cursor-pointer rounded-lg transition-all">
              <CardContent className="p-0">
                <div className="relative aspect-video border-b">
                  {post.full_picture ? (
                    <Image
                      src={post.full_picture}
                      alt={post.message || "Facebook Post"}
                      fill
                      sizes="100%"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
              </CardContent>

              <CardFooter className="py-3">
                <div className="flex items-center gap-3">
                  {pagePicture && (
                    <Image
                      src={pagePicture}
                      className="h-8 w-8 rounded-full bg-secondary object-contain"
                      alt={pageName || "Page"}
                      height={32}
                      width={32}
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    <h6 className="text-sm font-medium line-clamp-1">
                      {pageName}
                    </h6>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(post.created_time), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {/* Show More button */}
      {visibleCount < posts.length && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={handleShowMore}>
            Show More
          </Button>
        </div>
      )}

      {/* <div className="mt-6 text-center">
        <Button variant="outline">
          <Link href={pageUrl} target="_blank" rel="noopener noreferrer">
            View All Posts
          </Link>
        </Button>
      </div> */}
    </>
  );
}
