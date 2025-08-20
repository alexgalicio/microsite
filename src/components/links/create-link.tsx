"use client";

import { Button } from "@/components/ui/button";
import { useLink } from "./link-context";
import { Plus } from "lucide-react";

export function CreateLinkButton() {
  const { setOpen } = useLink();
  return (
    <Button className="space-x-1" onClick={() => setOpen("add")}>
      <Plus size={18} /> <span>Add Link</span>
    </Button>
  );
}
