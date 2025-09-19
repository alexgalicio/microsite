/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
    <form onSubmit={handleSubmit} className="relative w-full">
      <Textarea
        onChange={handleInputChange}
        value={input}
        placeholder="Write a message"
        className="resize-none pr-9 max-h-16"
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-0 bottom-0 m-3 h-8 w-8 rounded-full"
      >
        <ArrowUp />
        <span className="sr-only">Submit</span>
      </Button>
    </form>
  );
}
