"use client";
import React, { useEffect, useState } from "react";
import HomePage from "./Home/page";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/shadcn-io/button";
import { ArrowDownCircleIcon, MessageCircle, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn-io/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {useChat} from "@ai-sdk/react";
export default function MainPageS() {
  const [showChat, setShowChat] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [ScrollY, setScrollY] = useState(0);
  const chatIconRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleChat = () => {
      if (window.scrollY > 200) {
        setShowChat(true);
      } else {
        setShowChat(false);
        setIsChatOpen(false);
      }
    };
    window.addEventListener("scroll", handleChat);
    return () => {
      window.removeEventListener("scroll", handleChat);
    };
  }, []);
  const toogleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  return (
    <>
      <HomePage />
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Button
              type="button"
              ref={chatIconRef}
              onClick={toogleChat}
              size="icon"
              className="rounded-full size-14"
            >
              {!isChatOpen ? (
                <MessageCircle className="size=12" />
              ) : (
                <ArrowDownCircleIcon />
              )}
            </Button>

            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                className="mt-2 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <Card className="border-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-center">
                      Chat with our AI.......
                    </CardTitle>
                    <Button
                      onClick={toogleChat}
                      variant="ghost"
                      size="sm"
                      className="px-2 py-0"
                    >
                      <X className="size-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="w-full mt-32 text-gray-400 items-center justify-center flex gap-3">
                        No messages yet
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
