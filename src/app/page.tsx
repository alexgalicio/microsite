"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, RotateCcw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
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
  const [showBubble, setShowBubble] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    input,
    handleInputChange,
    handleSubmit,
    messages,
    status,
    setMessages,
  } = useChat();

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

  // clear all message
  const restartChat = () => {
    setMessages([]);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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
            animate={{
              opacity: 1,
              scale: 1,
              width: isExpanded ? "600px" : "360px",
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 z-50 w-90 max-w-[90vw]"
          >
            <Card className="shadow-2xl pt-0 gap-0 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-3 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-t-lg">
                <Image
                  src="/images/foxy-text.svg"
                  alt="Foxy"
                  width={85}
                  height={40}
                  className="object-contain"
                />
                <CardAction>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleExpand}
                    className="hover:text-primary"
                    title={isExpanded ? "Minimize" : "Expand"}
                  >
                    {isExpanded ? (
                      <Minimize2 className="size-4" />
                    ) : (
                      <Maximize2 className="size-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={restartChat}
                    className="hover:text-primary"
                    title="Clear Chat"
                  >
                    <RotateCcw className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleChat}
                    className="hover:text-primary"
                    title="Close"
                  >
                    <X className="size-4" />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="pr-1 pl-4">
                <ScrollArea className="h-[400px] pr-6 pb-4">
                  <div className="space-y-4 pt-4">
                    <div className="flex gap-2 items-end">
                      <Image
                        src="/images/foxy.svg"
                        alt="Foxy"
                        width={44}
                        height={44}
                        className="object-contain"
                      />

                      <div className="rounded-lg bg-muted px-3 py-2 rounded-bl-none text-sm">
                        What the fox! I&apos;m Foxy🦊, what can I help you with?
                      </div>
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
              className="relative cursor-pointer"
            >
              {showBubble && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="absolute -top-6 -left-20 bg-white text-black text-sm px-3 py-1 rounded-full rounded-br-none shadow-md flex items-center gap-2"
                >
                  <span className="text-base">
                    Hi <span className="wave">👋</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent toggling chat when closing bubble
                      setShowBubble(false);
                    }}
                    className="text-sm text-gray-500 hover:text-gray-800 font-bold"
                  >
                    ×
                  </button>
                </motion.div>
              )}

              <Image
                src="/images/foxy.svg"
                alt="Foxy"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
