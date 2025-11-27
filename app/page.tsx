"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Loader2, Plus, Square, Sparkles } from "lucide-react";
import { MessageWall } from "@/components/messages/message-wall";
import { ChatHeader } from "@/app/parts/chat-header";
import { ChatHeaderBlock } from "@/app/parts/chat-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UIMessage } from "ai";
import { useEffect, useState, useRef } from "react";
import { AI_NAME, CLEAR_CHAT_TEXT, OWNER_NAME, WELCOME_MESSAGE } from "@/config";
import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty.")
    .max(2000, "Message must be at most 2000 characters."),
});

const STORAGE_KEY = 'chat-messages';

type StorageData = {
  messages: UIMessage[];
  durations: Record<string, number>;
};

const loadMessagesFromStorage = (): { messages: UIMessage[]; durations: Record<string, number> } => {
  if (typeof window === 'undefined') return { messages: [], durations: {} };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { messages: [], durations: {} };

    const parsed = JSON.parse(stored);
    return {
      messages: parsed.messages || [],
      durations: parsed.durations || {},
    };
  } catch (error) {
    console.error('Failed to load messages from localStorage:', error);
    return { messages: [], durations: {} };
  }
};

const saveMessagesToStorage = (messages: UIMessage[], durations: Record<string, number>) => {
  if (typeof window === 'undefined') return;
  try {
    const data: StorageData = { messages, durations };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save messages to localStorage:', error);
  }
};

export default function Chat() {
  const [isClient, setIsClient] = useState(false);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const welcomeMessageShownRef = useRef<boolean>(false);

  const stored = typeof window !== 'undefined' ? loadMessagesFromStorage() : { messages: [], durations: {} };
  const [initialMessages] = useState<UIMessage[]>(stored.messages);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    messages: initialMessages,
  });

  useEffect(() => {
    setIsClient(true);
    setDurations(stored.durations);
    setMessages(stored.messages);
  }, []);

  useEffect(() => {
    if (isClient) {
      saveMessagesToStorage(messages, durations);
    }
  }, [durations, messages, isClient]);

  const handleDurationChange = (key: string, duration: number) => {
    setDurations((prevDurations) => {
      const newDurations = { ...prevDurations };
      newDurations[key] = duration;
      return newDurations;
    });
  };

  useEffect(() => {
    if (isClient && initialMessages.length === 0 && !welcomeMessageShownRef.current) {
      const welcomeMessage: UIMessage = {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        parts: [
          {
            type: "text",
            text: WELCOME_MESSAGE,
          },
        ],
      };
      setMessages([welcomeMessage]);
      saveMessagesToStorage([welcomeMessage], {});
      welcomeMessageShownRef.current = true;
    }
  }, [isClient, initialMessages.length, setMessages]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    sendMessage({ text: data.message });
    form.reset();
  }

  function clearChat() {
    const newMessages: UIMessage[] = [];
    const newDurations = {};
    setMessages(newMessages);
    setDurations(newDurations);
    saveMessagesToStorage(newMessages, newDurations);
    toast.success("Chat cleared");
  }

  return (
    <div className="flex h-screen items-center justify-center font-sans bg-gradient-healthcare dark:bg-gradient-healthcare-dark">
      <main className="w-full h-screen relative">
        <div className="fixed top-0 left-0 right-0 z-50 overflow-visible px-4 pt-4">
          <div className="relative overflow-visible max-w-5xl mx-auto">
            <ChatHeader>
              <ChatHeaderBlock />
              <ChatHeaderBlock className="justify-center items-center">
                <div className="relative">
                  <Avatar className="size-10 ring-2 ring-primary/30 shadow-lg transition-transform duration-300 hover:scale-105">
                    <AvatarImage src="/logo.png" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80">
                      <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-full" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-white dark:border-card animate-pulse-soft" />
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-foreground tracking-tight text-base">{AI_NAME}</p>
                  <p className="text-xs text-muted-foreground">Clinical Decision Support</p>
                </div>
              </ChatHeaderBlock>
              <ChatHeaderBlock className="justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer gap-2 rounded-xl border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 font-medium"
                  onClick={clearChat}
                >
                  <Plus className="size-4" />
                  {CLEAR_CHAT_TEXT}
                </Button>
              </ChatHeaderBlock>
            </ChatHeader>
          </div>
        </div>
        <div className="h-screen overflow-y-auto scrollbar-thin px-4 py-4 w-full pt-[100px] pb-[160px]">
          <div className="flex flex-col items-center justify-end min-h-full">
            {isClient ? (
              <>
                <MessageWall messages={messages} status={status} durations={durations} onDurationChange={handleDurationChange} />
                {status === "submitted" && (
                  <div className="flex justify-start max-w-3xl w-full mt-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center max-w-2xl w-full">
                <div className="flex items-center gap-3">
                  <Loader2 className="size-5 animate-spin text-primary" />
                  <span className="text-muted-foreground">Loading chat...</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-50 overflow-visible">
          <div className="w-full px-4 pt-6 pb-2 items-center flex justify-center relative overflow-visible">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none" />
            <div className="max-w-3xl w-full relative">
              <form id="chat-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="chat-form-message" className="sr-only">
                          Message
                        </FieldLabel>
                        <div className="relative">
                          <div className="relative input-glow rounded-2xl bg-card/80 dark:bg-card/60 backdrop-blur-md transition-all duration-300">
                            <Input
                              {...field}
                              id="chat-form-message"
                              className="h-14 pr-14 pl-5 bg-transparent border-0 rounded-2xl text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Ask me anything about patient care..."
                              disabled={status === "streaming"}
                              aria-invalid={fieldState.invalid}
                              autoComplete="off"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  form.handleSubmit(onSubmit)();
                                }
                              }}
                            />
                            {(status == "ready" || status == "error") && (
                              <Button
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl size-10 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
                                type="submit"
                                disabled={!field.value.trim()}
                                size="icon"
                              >
                                <ArrowUp className="size-5" />
                              </Button>
                            )}
                            {(status == "streaming" || status == "submitted") && (
                              <Button
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl size-10 bg-destructive hover:bg-destructive/90 shadow-lg transition-all duration-200"
                                size="icon"
                                onClick={() => {
                                  stop();
                                }}
                              >
                                <Square className="size-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </div>
          </div>
          <div className="w-full px-4 py-3 items-center flex justify-center text-xs text-muted-foreground/70">
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-3" />
              <span>Powered by AI</span>
              <span className="mx-2">|</span>
              <span>&copy; {new Date().getFullYear()} {OWNER_NAME}</span>
              <span className="mx-2">|</span>
              <Link href="/terms" className="hover:text-primary transition-colors duration-200 underline-offset-2 hover:underline">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
