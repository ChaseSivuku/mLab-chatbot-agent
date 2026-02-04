import { useState } from 'react';
import ChatbotModal from './containers/ChatbotModal';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* The trigger button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="bg-[#003D4D] text-white px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all"
      >
        Chat with us
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