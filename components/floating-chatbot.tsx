"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles, TrendingUp, Target, MessageCircle, X, Minimize2 } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  suggestions?: string[]
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm TrendBot, your AI beauty trend analyst. I can help you discover emerging trends, analyze competitor strategies, or predict trend lifecycles. What would you like to explore?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: [
        "What's trending in skincare right now?",
        "Analyze #CleanGirl movement",
        "Show me Gen Z beauty preferences",
        "Predict next viral makeup trend",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateBotResponse(content),
        sender: "bot",
        timestamp: new Date(),
        suggestions: generateSuggestions(content),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("skincare") || input.includes("skin")) {
      return "🔍 **Current Skincare Trends Analysis:**\n\n• **#SkinCycling** - 847% growth, Peak phase (2-3 weeks remaining)\n• **Slugging** - Declining (-23% this month)\n• **Skin Minimalism** - Emerging (+156% mentions)\n\n**L'Oréal Opportunity:** Launch retinol education content to ride the #SkinCycling wave. Optimal engagement window: Next 10 days."
    }

    if (input.includes("cleangirl") || input.includes("clean girl")) {
      return "📊 **#CleanGirl Movement Deep Dive:**\n\n**Lifecycle Status:** Mature (18 months active)\n**Current Phase:** Stable plateau\n**Audience:** 67% Gen Z, 28% Millennial\n\n**Key Insights:**\n• Evolved into 'Effortless Glam' micro-trends\n• High engagement in morning routines\n• Opportunity: Clean beauty product positioning"
    }

    if (input.includes("gen z") || input.includes("genz")) {
      return "🎯 **Gen Z Beauty Preferences (Q4 2024):**\n\n**Top Categories:**\n1. Lip products (73% engagement)\n2. Brow styling (68%)\n3. Skin tints (61%)\n\n**Behavior Patterns:**\n• 3.2x more likely to try viral trends\n• Prefer authentic, unfiltered content\n• Value sustainability messaging (+45% engagement)"
    }

    if (input.includes("predict") || input.includes("next") || input.includes("viral")) {
      return "🔮 **Next Viral Trend Prediction:**\n\n**High Probability (85% confidence):**\n**'Dopamine Makeup'** - Bright, mood-boosting colors\n\n**Early Signals:**\n• +234% mentions in past 2 weeks\n• Celebrity adoption (3 major influencers)\n• Peak timing: 3-4 weeks from now\n\n**Action Plan:** Prepare colorful eyeshadow content and partner with micro-influencers in wellness space."
    }

    return "I can help you analyze beauty trends, predict viral movements, and identify opportunities for L'Oréal brands. Try asking about specific trends, demographics, or competitive analysis!"
  }

  const generateSuggestions = (userInput: string): string[] => {
    const suggestions = [
      "Show competitor analysis for this trend",
      "What's the optimal engagement timing?",
      "Break down by demographic segments",
      "Find similar emerging trends",
      "Generate content strategy recommendations",
    ]
    return suggestions.slice(0, 3)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 pulse-glow z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl transition-all duration-300 ${isMinimized ? "h-14" : "h-[500px]"}`}>
        <CardHeader className="p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <CardTitle className="text-sm font-semibold">TrendBot AI</CardTitle>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
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
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === "user" ? "bg-primary ml-2" : "bg-muted mr-2"}`}
                      >
                        {message.sender === "user" ? (
                          <User className="w-3 h-3 text-primary-foreground" />
                        ) : (
                          <Bot className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 text-xs ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        <div className="whitespace-pre-line">{message.content}</div>
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
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <div className="border-t p-3">
              <div className="flex space-x-2 mb-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about trends..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
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
                  onClick={() => handleSendMessage("What's trending in skincare?")}
                >
                  <Sparkles className="w-2 h-2 mr-1" />
                  Skincare
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs cursor-pointer h-5"
                  onClick={() => handleSendMessage("Analyze competitor strategies")}
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
  )
}
