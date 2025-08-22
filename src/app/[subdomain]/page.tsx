"use client";

import PrivateSite from "@/components/microsites/private-site";
import { getSiteData } from "@/lib/actions/site";
import { useSite } from "@/components/subdomain-provider";
import { useEffect, useState } from "react";

export default function SubdomainPage() {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const site = useSite();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getSiteData(site.id);
      if (!response || !response.success) {
        return (
          <div className="p-4">
            <h2>Error Loading Page</h2>
            <p>{response.error}</p>
          </div>
        );
      } else if (!response || !response.data) {
        return <PrivateSite />;
      }

      setHtml(response.data.html || "");
      setCss(response.data.css || "");
    };
    fetchData();
  }, [site.id]);

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
