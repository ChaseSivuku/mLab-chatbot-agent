import { X } from "lucide-react";

interface CookieConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

const CookieConsentModal = ({
  isOpen,
  onAccept,
  onDecline,
  onClose,
}: CookieConsentModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50">
      <div
        className="relative bg-white border-2 sm:border-4 border-[#F5F5F5] max-w-md w-full overflow-hidden rounded-lg sm:rounded-none"
        role="dialog"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-description"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 cursor-pointer p-1 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={20} className="sm:w-6 sm:h-6" strokeWidth={2} />
        </button>

        <div className="p-6 sm:p-8 pt-8 sm:pt-10 text-center">
          <h2
            id="cookie-title"
            className="text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4"
          >
            We use cookies.
          </h2>
          <p
            id="cookie-description"
            className="text-xs sm:text-sm text-zinc-800 leading-relaxed mb-5 sm:mb-6"
          >
            To enhance your chat experience and save your conversation history,
            we use cookies. This helps our chatbot remember preferences for
            future interactions.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
            <button
              onClick={onAccept}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-[#a6ce39] cursor-pointer text-white text-sm sm:text-base font-medium rounded-full hover:bg-[#95b832] transition-colors"
            >
              Accept cookies
            </button>
            <button
              onClick={onDecline}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white cursor-pointer text-zinc-800 text-sm sm:text-base font-medium rounded-full border-2 border-[#a6ce39] hover:bg-zinc-50 transition-colors"
            >
              Decline cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentModal;
