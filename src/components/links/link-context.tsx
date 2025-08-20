"use client";

import React, { useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";
import { Links } from "@/lib/schema";

type LinkDialogType = "add" | "edit" | "delete";

interface LinkContextType {
  open: LinkDialogType | null;
  setOpen: (str: LinkDialogType | null) => void;
  currentRow: Links | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Links | null>>;
}

const LinkContext = React.createContext<LinkContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function LinkProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<LinkDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Links | null>(null);

  return (
    <LinkContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LinkContext>
  );
}

export const useLink = () => {
  const linkContext = React.useContext(LinkContext);

  if (!linkContext) {
    throw new Error("useLink has to be used within <LinkContext>");
  }

  return linkContext;
};
