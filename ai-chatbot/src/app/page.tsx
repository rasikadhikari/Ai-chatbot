"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/shadcn-io/button";
import { ArrowDownCircleIcon, MessageCircle, Send, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn-io/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import HomePage from "./Home/page";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: Date;
};

export default function MainPageS() {
  const [showChat, setShowChat] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) setShowChat(true);
      else {
        setShowChat(false);
        setIsChatOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok || !response.body)
        throw new Error("No response from AI");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      console.log("📡 Starting Gemini stream...");

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log(" Stream complete. Final:", assistantContent);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log("Raw chunk:", chunk);

        const textChunk = chunk.replace(/^data:\s*/, "").trim();
        if (textChunk && textChunk !== "[DONE]") {
          for (const char of textChunk) {
            assistantContent += char;
            await new Promise((r) => setTimeout(r, 10));

            setMessages((prev) => {
              const updated = [...prev];
              const lastIndex = updated.findIndex(
                (m) => m.role === "assistant" && m.content === ""
              );
              if (lastIndex !== -1) {
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  content: assistantContent,
                };
              } else {
                updated[updated.length - 1].content = assistantContent;
              }
              return updated;
            });
          }
        }
      }
    } catch (err) {
      console.error(" Stream error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HomePage />
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            {/* Chat Toggle Button */}
            <Button
              type="button"
              onClick={() => setIsChatOpen(!isChatOpen)}
              size="icon"
              className="rounded-full size-14"
            >
              {!isChatOpen ? (
                <MessageCircle className="size-12" />
              ) : (
                <ArrowDownCircleIcon />
              )}
            </Button>

            {/* Chat Card */}
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="mt-2 w-80 h-[480px] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <Card className="border-2 h-full flex flex-col">
                  {/* Header */}
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-center">
                      Chat with our AI
                    </CardTitle>
                    <Button
                      onClick={() => setIsChatOpen(false)}
                      variant="ghost"
                      size="sm"
                      className="px-2 py-0"
                    >
                      <X className="size-4" />
                    </Button>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea ref={scrollRef} className="h-full p-4">
                      {messages.length === 0 && (
                        <div className="w-full mt-24 text-gray-400 flex justify-center">
                          No messages yet
                        </div>
                      )}

                      {messages.map((m, i) => (
                        <div
                          key={i}
                          className={`mb-2 ${
                            m.role === "user" ? "text-right" : "text-left"
                          }`}
                        >
                          <span
                            className={`inline-block px-3 py-2 rounded-lg text-sm ${
                              m.role === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                            }`}
                          >
                            {m.content}
                          </span>
                        </div>
                      ))}

                      {isLoading && (
                        <div className="text-gray-400 text-center animate-pulse mt-2">
                          Thinking...
                        </div>
                      )}

                      {error && (
                        <div className="text-red-500 text-center mt-2">
                          {error}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>

                  {/* Input */}
                  <CardFooter className="p-2 border-t bg-background">
                    <form
                      onSubmit={handleFormSubmit}
                      className="flex w-full items-center space-x-2"
                    >
                      <Input
                        name="message"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1"
                        placeholder="Type your message..."
                        disabled={isLoading}
                      />
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="px-3"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
