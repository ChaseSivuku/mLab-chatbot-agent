import { useState } from 'react';
import ChatbotModal from './containers/ChatbotModal';
import CookieConsentModal from './components/CookieConsentModal';
import Navbar from './components/Navbar';

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
    <div className="h-screen overflow-hidden flex flex-col">
      {/*Navbar*/}
      <Navbar />
      <div className="relative flex-1 min-h-0 ">
        {/* Background Image - ends above chatbot button with small gap */}
        <div
          className="absolute top-0 left-0 right-0 bottom-28 sm:bottom-28 md:bottom-24 bg-cover sm:bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/pic.png')" }}
        ></div>

        {/* Gradient Overlay - ends above chatbot button with small gap */}
        <div className="absolute top-0 left-0 right-0 bottom-28 sm:bottom-28 md:bottom-24 bg-[#00303D]/90 opacity-99"></div>

        {/* Page Content */}
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex flex-col tracking-widest min-h-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-12 xl:px-16 max-w-full mt-12 sm:mt-16 md:mt-20 lg:mt-24 ml-4 sm:ml-8 md:ml-12 lg:ml-20 xl:ml-28">
            <h1 className="font-oswald text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl text-left leading-tight uppercase max-w-full">
              <span className="block">Supporting</span>
              <span className="block">Promising start-ups</span>
              <span className="block">To Become great</span>
              <span className="block">Businesses</span>
            </h1>
            <h3 className="text-white text-xs sm:text-sm md:text-base lg:text-lg mt-3 sm:mt-4 max-w-full lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl leading-snug">
              Registered Non-Profit (Mobile Applications Laboratory NPC) & Level 1 B-BBEE Skills & ESD Provider
            </h3>
          </div>
          
          {/* Chat Button */}
          <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-6 md:right-8 z-50">
            <button
              onClick={handleChatButtonClick}
              className="bg-[#a6ce39] cursor-pointer text-white px-3 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3 rounded-full font-medium hover:bg-opacity-90 transition-all text-sm sm:text-base shadow-lg"
            >
              <img src="/smile.png" alt="Chat Icon" className="w-6 h-6 sm:w-8 sm:h-8 mr-1.5 sm:mr-2 inline-block" />
              <span className="xs:inline sm:inline">Chat with us</span>
            </button>

            <CookieConsentModal
              isOpen={isCookieModalOpen}
              onAccept={handleAcceptCookies}
              onDecline={handleDeclineCookies}
              onClose={handleCloseCookieModal}
            />

            <ChatbotModal
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;