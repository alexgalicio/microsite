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
  const [isMobile, setIsMobile] = useState(false);

  const {
    input,
    handleInputChange,
    handleSubmit,
    messages,
    status,
    setMessages,
    append,
  } = useChat();

  // ref for chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const handleSampleQuestionClick = async (question: string) => {
    const response = await saveUserQuestion(question);
    if (response.error) {
      console.error("Error saving question:", response.error);
    }

    // send the message directly
    append({
      role: "user",
      content: question,
    });
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
              width: isMobile ? "100vw" : isExpanded ? "600px" : "360px",
              height: isMobile ? "100vh" : "auto",
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-50 ${
              isMobile ? "inset-0" : "bottom-4 right-4 w-90 max-w-[90vw]"
            }`}
          >
            <Card
              className={`shadow-2xl pt-0 gap-0 overflow-hidden ${
                isMobile ? "h-full w-full rounded-none" : ""
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between py-3 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-t-lg">
                <Image
                  src="/images/foxy-text.svg"
                  alt="Foxy"
                  width={85}
                  height={40}
                  className="object-contain"
                />
                <CardAction>
                  {!isMobile && (
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
                  )}
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
              <CardContent className="pr-1 pl-4 flex-1 overflow-hidden">
                <ScrollArea
                  className={`pr-6 pb-4 ${
                    isMobile ? "h-[calc(100vh-140px)]" : "h-[420px]"
                  }`}
                >
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
                        I am <strong>Foxy</strong>, your CICT assistant chatbot.
                        <br />
                        <br />
                        <span className="italic">
                          I am powered by artificial intelligence and I strive
                          to provide fast and helpful responses. Please note
                          that while I do my best, my answers are automatically
                          generated and may not always be fully accurate or
                          complete.
                        </span>
                      </div>
                    </div>

                    {/* show sample quesions when chat is empty */}
                    {messages.length === 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 ml-12">
                        {[
                          "What are the courses offered by CICT?",
                          "How do I enroll in BulSU?",
                          "Who is the current dean of CICT?",
                          "Where is the OJT office?",
                        ].map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs rounded-full hover:bg-primary hover:text-primary-foreground"
                            onClick={() => handleSampleQuestionClick(question)}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    )}

                    <ChatOutput messages={messages} status={status} />
                    <div ref={chatContainerRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="mt-auto">
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
