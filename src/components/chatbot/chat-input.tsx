/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: any) => void;
  handleSubmit: (e: any) => void;
  isLoading?: boolean;
}

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading = false,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        handleSubmit(e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Textarea
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={input}
        placeholder="Write a message"
        className="resize-none pr-9 max-h-16"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-0 bottom-0 m-3 h-8 w-8 rounded-full"
        disabled={isLoading || !input.trim()}
      >
        <ArrowUp />
        <span className="sr-only">Submit</span>
      </Button>
    </form>
  );
}
