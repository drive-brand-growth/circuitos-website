"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatResponse {
  response: string;
  session_id: string;
  lead_score: number;
  lead_tier: string;
  persona: {
    segment: string;
    buyingStage: string;
    urgency: string;
  };
  quick_replies?: string[];
  conversion_nudge?: {
    message: string;
    cta: string;
    cta_url: string;
  };
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [leadTier, setLeadTier] = useState<string>("cold");
  const [quickReplies, setQuickReplies] = useState<string[]>(["What do you build?", "See results", "Book a call"]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Generate session ID on mount
    setSessionId(`dbg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  const sendMessage = async (directMessage?: string) => {
    const messageToSend = directMessage || input.trim();
    if (!messageToSend || isLoading) return;

    const userMessage = messageToSend;
    setInput("");
    setIsLoading(true);

    // Add user message
    const newUserMessage: Message = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId,
        }),
      });

      const data: ChatResponse = await response.json();

      // Update session ID if provided
      if (data.session_id) {
        setSessionId(data.session_id);
      }

      // Update lead tier for visual feedback
      if (data.lead_tier) {
        setLeadTier(data.lead_tier);
      }

      // Update quick replies
      if (data.quick_replies) {
        setQuickReplies(data.quick_replies);
      }

      // Add assistant message
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Show conversion nudge if present
      if (data.conversion_nudge && data.lead_tier !== "cold") {
        setTimeout(() => {
          const nudgeMessage: Message = {
            role: "assistant",
            content: `${data.conversion_nudge!.message}\n\n[${data.conversion_nudge!.cta}](${data.conversion_nudge!.cta_url})`,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, nudgeMessage]);
        }, 2000);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "I apologize, but I encountered an error. Please try again or contact noel@drivebrandgrowth.com directly.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Convert markdown-style formatting
    return content
      .split("\n")
      .map((line) => {
        // Convert **bold** to <strong>
        line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        // Convert [text](url) to links
        line = line.replace(
          /\[(.*?)\]\((.*?)\)/g,
          '<a href="$2" class="text-white underline hover:text-neutral-300" target="_blank" rel="noopener">$1</a>'
        );
        return line;
      })
      .join("<br/>");
  };

  const getTierColor = () => {
    switch (leadTier) {
      case "qualified":
        return "bg-blue-400";
      case "hot":
        return "bg-blue-500";
      case "warm":
        return "bg-blue-600";
      default:
        return "bg-zinc-500";
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-neutral-800 border border-neutral-700" : "bg-white hover:bg-neutral-200"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-black rounded-xl shadow-2xl flex flex-col border border-neutral-800">
          {/* Header */}
          <div className="bg-neutral-900 px-4 py-3 rounded-t-xl flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="text-black font-bold text-sm">DBG</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  Drive Brand Growth
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getTierColor()}`}></span>
                  <span className="text-neutral-500 text-xs">
                    {leadTier === "cold" ? "Online" : `Lead: ${leadTier}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-neutral-500 mt-8">
                <p className="text-sm mb-2 text-neutral-400">Welcome to Drive Brand Growth</p>
                <p className="text-xs">
                  Ask me about our AI automation systems, case studies, or book a
                  technical walkthrough.
                </p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-white text-black"
                      : "bg-neutral-900 text-neutral-200 border border-neutral-800"
                  }`}
                >
                  <div
                    className="text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(msg.content),
                    }}
                  />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {!isLoading && quickReplies.length > 0 && (
            <div className="px-4 py-2 border-t border-neutral-800 flex flex-wrap gap-2">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(reply)}
                  className="px-3 py-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 hover:border-blue-500/40 hover:text-blue-400 rounded-full transition-all duration-200"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-neutral-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about our AI systems..."
                className="flex-1 bg-zinc-900 text-white border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 placeholder:text-zinc-600"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 text-black rounded-lg px-4 py-2 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
            <p className="text-neutral-600 text-xs mt-2 text-center">
              Powered by CircuitOS™
            </p>
          </div>
        </div>
      )}
    </>
  );
}
