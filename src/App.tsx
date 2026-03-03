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
    <>
      {/*Navbar*/}
      <Navbar />
      <div className="relative min-h-screen ">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat "
          style={{ backgroundImage: "url('/pic.png')" }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-[#00303D]/90 opacity-99"></div>

        {/* Page Content */}
        <div className="relative z-10">
          <div className="">
            <h1 className="text-white text-9xl font-bold">Supporting promising start-ups to become great businesses</h1>
          </div>
          {/* Chat Button */}
          <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
            <button
              onClick={handleChatButtonClick}
              className="bg-[#a6ce39] cursor-pointer text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-full font-medium hover:bg-opacity-90 transition-all text-sm sm:text-base shadow-lg"
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
    </>
  );
}

export default App;