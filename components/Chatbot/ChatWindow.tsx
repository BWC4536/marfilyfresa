"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello. Welcome to MarfilYFresa. How may I assist you with our jewelry collection today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "I'm sorry, I am experiencing a temporary issue connecting to the boutique. Please try again later." }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "I apologize, but an unexpected error occurred." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] mb-4 bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
          
          {/* Header */}
          <div className="bg-mf-primary/90 text-mf-charcoal p-4 flex justify-between items-center border-b border-white/40">
            <div>
              <h3 className="font-serif font-bold text-lg">MarfilYFresa Concierge</h3>
              <p className="text-xs font-medium opacity-80">Always here to help</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-mf-charcoal hover:opacity-70 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-mf-background/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user" 
                      ? "bg-mf-charcoal text-mf-background rounded-tr-sm" 
                      : "bg-white border border-gray-100 text-mf-charcoal rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 text-mf-charcoal p-3 rounded-2xl rounded-tl-sm shadow-sm flex space-x-2 items-center">
                  <div className="w-2 h-2 bg-mf-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-mf-primary rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-mf-primary rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white/90 border-t border-white/50 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our jewelry..." 
              className="flex-1 px-4 py-2 rounded-full border border-gray-200 bg-white focus:outline-none focus:border-mf-primary focus:ring-1 focus:ring-mf-primary text-sm transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-mf-primary text-mf-charcoal px-4 py-2 rounded-full font-semibold hover:bg-mf-secondary transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-mf-charcoal text-mf-background rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-300 border-2 border-white/20"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
}