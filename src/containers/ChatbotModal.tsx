import { useState } from "react";
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
}

const ChatbotModal = ({ isOpen, onClose }: ChatbotModalProps) => {
  const [inputValue, setInputValue] = useState("");

  // 2. Initialize state with the first bot message
  const [messages, setMessages] = useState<Message[]>([]);

  const [isTyping, setIsTyping] = useState(false);

  // 3. Define handleSelect to manage button clicks
  const handleSelect = (category: string) => {
    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: category,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMsg]);

    // Simulate Bot Thinking
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "";
      let special = false;

      if (category === "Eligibility") {
        botResponse =
          "Our general eligibility criteria are: South African citizen (18-35), currently unemployed, and a minimum NQF Level 5 in IT or Computer Science.";
        special = true;
      } else {
        botResponse = `Our general eligibility criteria are: South African citizen (18-35), currently unemployed, and a minimum NQF Level 5 in IT or Computer Science."`;
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        isSpecial: special,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  // 4. Handle Text Input Submission
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    handleSelect(inputValue);
    setInputValue("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex">
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
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={28} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-4 bg-zinc-50/50">
          
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-6">
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
            ))}
          </div>

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              sender={msg.sender}
              text={msg.text}
            />
          ))}

          {isTyping && (
            <div className="text-[#a6ce39] font-medium italic animate-pulse">
              Thinking...
            </div>
          )}
        </main>

        <footer className="p-6 bg-white border-t border-zinc-100 flex items-center gap-1">
          <div>
           <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); 
                  handleSendMessage();
                }
              }}
              placeholder="Type your message here…"
              rows={2}
              className="
                w-[680px]
                p-4 pr-16
                bg-white border border-[#003d4d]
                rounded-xl
                focus:border-[#003d4d] focus:outline-none
                transition-all text-zinc-800
                whitespace-pre-wrap break-words leading-relaxed
              "
            />
          </div>

          <div>
            <button
              onClick={handleSendMessage}
              className="p-2.5 bg-[#003D4D] text-white rounded-full hover:bg-[#002A35] transition-transform active:scale-95"
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
