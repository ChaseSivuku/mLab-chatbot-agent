import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import MessageBubble from "../components/MessageBubble";
import CategoryButton from "../components/CategoryButton";


interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. Define the structure of a message
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  isSpecial?: boolean;
  timestamp: Date;
}

// API configuration - use relative path for proxy in development, or full URL for production
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:3000/api'

// API helper functions
const sendChatMessage = async (message: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.reply;
};

const sendCategoryRequest = async (category: string): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.reply;
};

const ChatbotModal = ({ isOpen, onClose }: ChatbotModalProps) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message when messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 3. Define handleSelect to manage button clicks
  const handleSelect = async (category: string) => {
    const now = new Date();
    const userMsg: Message = {
      id: Date.now().toString(),
      text: category,
      sender: "user",
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const botResponse = await sendCategoryRequest(category);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error fetching category response:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing technical difficulties. Please try again later or contact mLab support.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // 4. Handle Text Input Submission
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const messageText = inputValue.trim();
    const now = new Date();
    const userMsg: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Reset textarea height to original size
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "44px";
    }

    try {
      const botResponse = await sendChatMessage(messageText);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error fetching chat response:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm experiencing technical difficulties. Please try again later or contact mLab support.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[100] flex">
      <div className="bg-white w-3xl max-w-4xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200">
        
        {/* Header */}
        <header className="bg-[#003d4d] p-5 flex justify-between items-center text-white">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="mLab Logo" className="h-8" />
          </div>

          {/* Right: Online status + Close */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              <div className="w-2.5 h-2.5 bg-[#a6ce39] rounded-full animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Online
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 cursor-pointer rounded-full transition-colors"
            >
              <X size={28} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-4 bg-zinc-50/50 flex flex-col">
          
          {/* Friendly Intro Message */}
          <div className="max-w-3xl mb-6 text-zinc-700 text-sm leading-relaxed">
            <p>
              <span className="font-bold text-[#003D4D]">Hello!</span> I am your{" "}
              <span className="font-medium text-[#003D4D]">
                mLab Digital Assistant
              </span>
              . I can help you with information regarding our programmes,
              applications, eligibility, locations, and upcoming events.
            </p>
          </div>

          {/* Quick Actions Menu */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3  my-6">
            {[
              "Programs",
              "Applications",
              "Eligibility",
              "Location",
              "Events",
            ].map((cat) => (
              <CategoryButton
                key={cat}
                label={cat}
                onClick={() => handleSelect(cat)}
                
              />
            ))
            }
          </div>

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              sender={msg.sender}
              text={msg.text}
              timestamp={msg.timestamp}
            />
          ))}

          {isTyping && (
            <div className="text-[#a6ce39] font-medium italic animate-pulse">
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 bg-white border-t border-zinc-100 flex items-center gap-2 flex-shrink-0">
          <div className="flex-1 min-w-0">
           <textarea
  ref={textareaRef}
  value={inputValue}
  onChange={(e) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }}
  placeholder="Type your message here…"
  rows={1}
  className="
    w-full max-w-full
    min-h-[44px] max-h-[120px]
    p-3 pr-16
    text-base
    bg-white border border-[#003d4d]
    rounded-xl
    focus:border-[#003d4d] focus:outline-none
    transition-all text-zinc-800
    whitespace-pre-wrap break-words leading-relaxed
    resize-none overflow-y-auto
    hide-scrollbar
  "
/>

          </div>

          <div>
            <button
              onClick={handleSendMessage}
              className="p-2.5 bg-[#003D4D] cursor-pointer bottom-10 text-white rounded-full hover:bg-[#002A35] transition-transform active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatbotModal;
