import { useState } from 'react';
import ChatbotModal from './containers/ChatbotModal';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center">
     
      {/* The trigger button */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="bg-[#003d4d] text-white px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all"
      >
        Open Chatbot
      </button>

      {/* The Modal Component */}
      <ChatbotModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
}

export default App;