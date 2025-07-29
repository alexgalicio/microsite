"use client";

import React, { useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";
import { Submenu } from "@/lib/schema";

type SubmenuDialogType = "edit" | "delete";

interface SubmenuContextType {
  open: SubmenuDialogType | null;
  setOpen: (str: SubmenuDialogType | null) => void;
  currentRow: Submenu | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Submenu | null>>;
}

const SubmenuContext = React.createContext<SubmenuContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function SubmenuProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<SubmenuDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Submenu | null>(null);

  return (
    <SubmenuContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SubmenuContext>
  );
}

export const useSubmenu = () => {
  const submenuContext = React.useContext(SubmenuContext);

  if (!submenuContext) {
    throw new Error("useSubmenu has to be used within <SubmenuContext>");
  }

  return submenuContext;
};
