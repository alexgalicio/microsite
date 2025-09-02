/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: any) => void;
  handleSubmit: (e: any) => void;
}

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Input
        onChange={handleInputChange}
        value={input}
        placeholder="Ask me something..."
      />
      <Button type="submit" size="icon">
        <ArrowUp />
        <span className="sr-only">Submit</span>
      </Button>
    </form>
  );
}
