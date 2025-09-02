"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownCircleIcon, MessageCircle, X } from "lucide-react";
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

export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatIcon, setShowChatIcon] = useState(false);
  const chatIconRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowChatIcon(true);
      } else {
        setShowChatIcon(false);
        setIsChatOpen(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
            className="fixed bottom-20 right-4 z-40 w-96 max-w-[90vw]"
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Foxy</CardTitle>
                <CardAction>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleChat}
                    className="h-8 w-8"
                  >
                    <X size={16} />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-3">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-primary text-primary-foreground p-2 rounded-bl-none">
                      Hi, my name is Foxy. How can I help you today?
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
            className="fixed bottom-4 right-4 z-50"
          >
            <Button
              ref={chatIconRef}
              onClick={toggleChat}
              size="icon"
              className="rounded-full size-14 p-2 shadow-lg"
            >
              {!isChatOpen ? (
                <MessageCircle size={16} />
              ) : (
                <ArrowDownCircleIcon size={16} />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
