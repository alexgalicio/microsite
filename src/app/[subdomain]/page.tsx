"use client";

import PrivateSite from "@/components/microsites/private-site";
import { getSiteData } from "@/lib/actions/site";
import { useSite } from "@/components/subdomain-provider";
import { useEffect, useState } from "react";
import { handleError } from "@/lib/utils";

export default function SubdomainPage() {
  const [error, setError] = useState<string | null>(null);
  const [showPrivateSite, setShowPrivateSite] = useState(false);
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const site = useSite();

  useEffect(() => {
    const fetchData = async () => {
      setError(null);

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
    };
    fetchData();
  }, [site.id]);

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
