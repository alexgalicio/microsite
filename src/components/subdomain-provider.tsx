/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext } from "react";

const SiteContext = createContext<any>(null);

export function SiteProvider({
  children,
  site,
}: {
  children: React.ReactNode;
  site: any;
}) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}
