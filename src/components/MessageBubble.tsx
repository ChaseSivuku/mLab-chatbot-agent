interface MessageProps {
  text: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageBubble = ({ text, sender, timestamp }: MessageProps) => {
  return (
    <>
      {/* Timestamp centered in the middle of the screen */}
      {timestamp && (
        <div className="w-full flex justify-center mb-2">
          <span className="text-xs text-zinc-500">
            {formatTime(timestamp)}
          </span>
        </div>
      )}
      
      {/* Message bubble */}
      {sender === 'user' ? (
        <div className="flex justify-end items-end gap-2 mb-4">
          <div className="flex flex-col items-end max-w-[80%] min-w-0">
            <div className="
              relative
              bg-[#a6ce39] text-black 
              px-6 py-3 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-none
              shadow-sm
              break-words whitespace-pre-wrap
              word-break break-word
              overflow-wrap break-word
              leading-relaxed
              w-full
              min-w-0
            ">
              {text}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-start items-start gap-2 mb-4">
          <img
            src="/chat-logo.jpg"
            alt="Bot"
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 mt-0.5 border-2 border-[#a6ce39]"
          />
          <div className="flex flex-col max-w-[85%]">
          <div className="
  relative
  mb-4
  max-w-[85%]
  p-4
  bg-white text-black
  border border-[#A6CE39]
  shadow-sm
  rounded-tr-2xl rounded-bl-2xl rounded-br-2xl rounded-tl-none
">

              {text}
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;
