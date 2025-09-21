"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@ai-sdk/react";
import ChatOutput from "@/components/chatbot/chat-output";
import ChatInput from "@/components/chatbot/chat-input";
import { saveUserQuestion } from "@/lib/actions/chatbot";
import LandingPage from "@/components/landing-page/main-page";
import Image from "next/image";

export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatIcon] = useState(true);
  const chatIconRef = useRef<HTMLDivElement>(null);

  const { input, handleInputChange, handleSubmit, messages, status } =
    useChat();

  // ref for chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // scroll to bottom function
  const scrollToBottom = () => {
    chatContainerRef.current?.scrollIntoView(false);
  };

  // scroll on new message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // scroll when chat opens
  useEffect(() => {
    if (isChatOpen) {
      // small delay to ensure DOM is rendered before scrolling
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isChatOpen]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleCustomSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.trim()) {
      const response = await saveUserQuestion(input.trim());
      if (response.error) {
        console.error("Error saving question:", response.error);
      }
    }

    handleSubmit(e);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <LandingPage />

      {/* chat window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50 w-90 max-w-[90vw]"
          >
            <Card className="shadow-2xl pt-0 gap-0 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-3 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-t-lg">
                <CardTitle className="text-xl font-semibold">Foxy</CardTitle>
                <CardAction>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleChat}
                    className="hover:bg-transparent"
                  >
                    <X className="size-5"/>
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="pr-1 pl-6">
                <ScrollArea className="h-[370px] pr-6 pb-4">
                  <div className="space-y-4 pt-4">
                    <div className="rounded-lg bg-muted px-3 py-2 rounded-bl-none text-sm">
                      Hi there! 👋 I&apos;m Foxy, what can I help you with?
                    </div>

                    <ChatOutput messages={messages} status={status} />
                    <div ref={chatContainerRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <ChatInput
                  input={input}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleCustomSubmit}
                />
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* chat toggle button */}
      <AnimatePresence>
        {showChatIcon && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-40"
          >
            <div
              ref={chatIconRef}
              onClick={toggleChat}
              className="rounded-full bg-primary cursor-pointer drop-shadow-lg p-2"
            >
              <Image
                src="/images/foxy.svg"
                alt="Chat Logo"
                width={54}
                height={54}
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
