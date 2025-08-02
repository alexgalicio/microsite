"use client";

import { Button } from "@/components/ui/button";
import { useSite } from "./site-context";
import { Plus } from "lucide-react";

export function CreateSiteButton() {
  const { setOpen } = useSite();
  return (
    <Button className="space-x-1" onClick={() => setOpen("add")}>
      <Plus size={18} /> <span>Create Site</span>
    </Button>
  );
}
