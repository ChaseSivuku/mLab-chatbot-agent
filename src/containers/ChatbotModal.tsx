import { useState } from 'react';
import { X, Send } from 'lucide-react';
import MessageBubble from '../components/MessageBubble';
import CategoryButton from '../components/CategoryButton';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. Define the structure of a message
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isSpecial?: boolean;
}

const ChatbotModal = ({ isOpen, onClose }: ChatbotModalProps) => {
  const [inputValue, setInputValue] = useState('');
  
  // 2. Initialize state with the first bot message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! I am your mLab Digital Assistant. I can help you with information regarding our programmes, applications, eligibility, locations, and upcoming events."
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);

  // 3. Define handleSelect to manage button clicks
  const handleSelect = (category: string) => {
    // Add User Message
    const userMsg: Message = { id: Date.now().toString(), text: category, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);

    // Simulate Bot Thinking
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "";
      let special = false;

      if (category === 'Eligibility') {
        botResponse = "Our general eligibility criteria are: South African citizen (18-35), currently unemployed, and a minimum NQF Level 5 in IT or Computer Science.";
        special = true;
      } else {
        botResponse = `You selected ${category}. How can I help you with that?`;
      }

      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: botResponse, 
        sender: 'bot', 
        isSpecial: special 
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  // 4. Handle Text Input Submission
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    handleSelect(inputValue);
    setInputValue('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-3xl max-w-4xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200">
        
        <header className="bg-[#003d4d] p-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="mLab Logo" className="h-8" />
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 ml-6 rounded-full border border-white/20">
              <div className="w-2.5 h-2.5 bg-[#a6ce39] rounded-full animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-wider">Online</span>
            </div>
          
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={28} />
          </button>
          
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-4 bg-zinc-50/50">
          
          {/* Quick Actions Menu */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-6">
            {['Programs', 'Applications', 'Eligibility', 'Location', 'Events'].map((cat) => (
              <CategoryButton key={cat} label={cat} onClick={() => handleSelect(cat)} />
            ))}
          </div>
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              sender={msg.sender} 
              text={msg.text} 
              isSpecial={msg.isSpecial} 
            />
          ))}
          

          {isTyping && (
            <div className="text-[#a6ce39] font-medium italic animate-pulse">Thinking...</div>
          )}

          
        </main>

        <footer className="p-6 bg-white border-t border-zinc-100">
          <div className="relative flex items-center max-w-5xl mx-auto">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type here..." 
              className="w-full p-4 pr-16 bg-white border-2 border-zinc-200 rounded-xl focus:border-[#003d4d] focus:outline-none transition-all text-zinc-800"
            />
            <button 
              onClick={handleSendMessage}
              className="absolute right-2 p-3 bg-[#003d4d] text-white rounded-full hover:bg-[#002a35] transition-transform active:scale-95"
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