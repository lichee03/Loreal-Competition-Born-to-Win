"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  Target,
  MessageCircle,
  X,
  Minimize2,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const initialBotMessage: Message[] = [
    {
      id: "1",
      content:
        "Hi! I'm TrendBot, your AI beauty trend analyst. I can help you discover emerging trends, analyze competitor strategies, or predict trend lifecycles. What would you like to explore?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "What's trending in skincare right now?",
        "Analyze #Makeup trend",
        "Show me Gen Z beauty preferences",
        "Predict next viral makeup trend",
      ],
    },
  ]
  const [messages, setMessages] = useState<Message[]>(initialBotMessage)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    setError(null)

    try {
      const res = await fetch("http://localhost:5001/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: content }),
      })
      if (!res.ok) {
        throw new Error("Failed to get response from Gemini API")
      }
      const data = await res.json()
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.result || "Sorry, I couldn't find an answer.",
        sender: "bot",
        timestamp: new Date(),
        // Optionally, you can generate suggestions here if needed
      }
      setMessages((prev) => [...prev, botResponse])
    } catch (err: any) {
      setError(err.message || "Something went wrong.")
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "Sorry, there was an error connecting to the AI.",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  // Render the floating button if the chatbot is closed
  if (!isOpen) {
    return (
      <Button
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 0)
        }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 pulse-glow z-50 bg-gradient-to-br from-background via-secondary/30 text-primary-foreground"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card
        className={`w-96 shadow-2xl transition-all duration-300 flex flex-col p-0 ${
          isMinimized ? "h-14" : "h-[500px]"
        }`}
      >
        <CardHeader className="p-4 bg-gradient-to-br from-background via-primary/90 to-background text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm font-semibold">
                TrendBot AI
              </CardTitle>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => {
                  setIsMinimized((prev) => {
                    const next = !prev
                    if (next === false) {
                      setTimeout(() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
                      }, 0)
                    }
                    return next
                  })
                }}
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => {
                  setIsOpen(false)
                  setIsMinimized(false)
                  setMessages(initialBotMessage)
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 p-4 overflow-y-auto h-[360px]">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[85%] ${
                        message.sender === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === "user"
                            ? "bg-primary ml-2"
                            : "bg-muted/50 mr-2"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="w-3 h-3 text-primary-foreground" />
                        ) : (
                          <Bot className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 text-xs ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/30"
                        }`}
                      >
                        <div className="whitespace-pre-line">
                          {message.content}
                        </div>
                        {message.suggestions && (
                          <div className="mt-2 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs mr-1 mb-1 h-6 bg-transparent"
                                onClick={() => handleSendMessage(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex">
                      <div className="w-6 h-6 rounded-full bg-muted mr-2 flex items-center justify-center">
                        <Bot className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div
                            className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="text-xs text-red-500">{error}</div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <div className="border-t p-3">
              <div className="flex space-x-2 mb-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about trends..."
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleSendMessage(inputValue)
                  }
                  className="flex-1 text-xs h-8"
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-1">
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer h-5"
                  onClick={() =>
                    handleSendMessage("What's trending in skincare?")
                  }
                >
                  <Sparkles className="w-2 h-2 mr-1" />
                  Skincare
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer h-5"
                  onClick={() =>
                    handleSendMessage("Analyze competitor strategies")
                  }
                >
                  <Target className="w-2 h-2 mr-1" />
                  Competitors
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer h-5"
                  onClick={() => handleSendMessage("Predict next viral trend")}
                >
                  <TrendingUp className="w-2 h-2 mr-1" />
                  Predict
                </Badge>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

