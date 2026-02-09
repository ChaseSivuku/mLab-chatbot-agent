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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 ">
      <div
        className="relative bg-white  border-4 border-[#F5F5F5] max-w-md w-full overflow-hidden"
        role="dialog"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-description"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer p-1 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <div className="p-8 pt-10 text-center">
          <h2
            id="cookie-title"
            className="text-xl font-bold text-black mb-4"
          >
            We use cookies.
          </h2>
          <p
            id="cookie-description"
            className="text-sm text-zinc-800 leading-relaxed mb-6"
          >
            To enhance your chat experience and save your conversation history,
            we use cookies. This helps our chatbot remember preferences for
            future interactions.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onAccept}
              className="px-5 py-2.5 bg-[#a6ce39] cursor-pointer text-white font-medium rounded-full hover:bg-[#95b832] transition-colors"
            >
              Accept cookies
            </button>
            <button
              onClick={onDecline}
              className="px-5 py-2.5 bg-white cursor-pointer text-zinc-800 font-medium rounded-full border-2 border-[#a6ce39] hover:bg-zinc-50 transition-colors"
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
