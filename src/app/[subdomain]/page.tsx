"use client";

import PrivateSite from "@/components/microsites/private-site";
import { getSiteData } from "@/lib/actions/site";
import { useSite } from "@/components/subdomain-provider";
import { useEffect, useState } from "react";
import { handleError } from "@/lib/utils";
import Image from "next/image";

export default function SubdomainPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPrivateSite, setShowPrivateSite] = useState(false);
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const site = useSite();

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true);

      try {
        const response = await getSiteData(site.id);
        if (response.success && response.data) {
          setHtml(response.data.html || "");
          setCss(response.data.css || "");
          setShowPrivateSite(false);
        } else if (!response || !response.data) {
          setShowPrivateSite(true);
        } else {
          setError(handleError(response.error));
        }
      } catch (error) {
        setError(handleError(error));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [site.id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center text-gray-500 px-4">
        <div className="flex flex-row gap-4 mb-6 items-center">
          <Image
            src="/images/bulsu.png"
            alt="Bulsu Logo"
            width={100}
            height={100}
            className="object-contain"
          />

          <Image
            src="/images/cict.png"
            alt="CICT Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-1 bg-gray-200 rounded overflow-hidden">
          <div className="h-full bg-primary animate-progress"></div>
        </div>

        <p className="mt-4 text-gray-600 text-center text-sm sm:text-base">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2>Error Loading Page</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (showPrivateSite) {
    return <PrivateSite />;
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: css,
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </>
  );
}
