"use client";

import React, { useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";
import { Site } from "@/lib/schema";

type SiteDialogType = "add" | "edit" | "archive" | "publish" | "unpublish";

interface SiteContextType {
  open: SiteDialogType | null;
  setOpen: (str: SiteDialogType | null) => void;
  currentRow: Site | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Site | null>>;
}

const SiteContext = React.createContext<SiteContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function SiteProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<SiteDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Site | null>(null);

  return (
    <SiteContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SiteContext>
  );
}

export const useSite = () => {
  const siteContext = React.useContext(SiteContext);

  if (!siteContext) {
    throw new Error("useSite has to be used within <SiteContext>");
  }

  return siteContext;
};
