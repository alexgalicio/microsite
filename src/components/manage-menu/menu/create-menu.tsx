"use client";

import { Button } from "@/components/ui/button";
import { useMenu } from "./menu-context";
import { Plus } from "lucide-react";

export function CreateMenuButton() {
  const { setOpen } = useMenu();
  return (
    <Button className="space-x-1" onClick={() => setOpen("add")}>
      <Plus size={18} /> <span>Create New</span>
    </Button>
  );
}
