import { useState } from 'react';
import ChatbotModal from './containers/ChatbotModal';
import CookieConsentModal from './components/CookieConsentModal';

const COOKIE_CONSENT_KEY = 'mlab-chatbot-cookie-consent';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  const handleChatButtonClick = () => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent !== null) {
      setIsChatOpen(true);
    } else {
      setIsCookieModalOpen(true);
    }
  };

  const handleAcceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsCookieModalOpen(false);
    setIsChatOpen(true);
  };

  const handleDeclineCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsCookieModalOpen(false);
    setIsChatOpen(true);
  };

  const handleCloseCookieModal = () => {
    setIsCookieModalOpen(false);
    setIsChatOpen(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* The trigger button */}
      <button
        onClick={handleChatButtonClick}
        className="bg-[#a6ce39] cursor-pointer text-white  px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all"
      >
        <img src="/smile.png" alt="Chat Icon" className="w-8 h-8 mr-2 inline-block" /> Chat with us
      </button>

      {/* Cookie consent – shows after "Chat with us", then opens chat */}
      <CookieConsentModal
        isOpen={isCookieModalOpen} 
        onAccept={handleAcceptCookies}
        onDecline={handleDeclineCookies}
       onClose={handleCloseCookieModal}
     />

      {/* The chat modal */}
      <ChatbotModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}

export default App;