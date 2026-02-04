interface MessageProps {
  text: string;
  sender: 'user' | 'bot';
}

const MessageBubble = ({ text, sender }: MessageProps) => {
  if (sender === 'user') {
    return (
      <div className="flex justify-end mb-4">
        {/* Added 'relative' so the tail stays attached to the bubble */}
        <div className="
          relative
          bg-[#a6ce39] text-black 
          px-6 py-3 rounded-2xl 
          max-w-[80%] shadow-sm
          break-words whitespace-pre-wrap
        ">
          {text}

          {/* User Bubble tail positioned at the bottom right */}
          <span
            className="
              absolute
              -bottom-[6px]
              right-4
              w-4
              h-4
              bg-[#a6ce39]
              rotate-45
              rounded-sm
            "
          />
        </div>
      </div>
    );
  }

  // BOT MESSAGE
  return (
    <div className="flex justify-start mb-4">
       {/* Added 'relative' and 'bg-white' to make the hollow effect work */}
      <div className="
        relative
        mb-4 max-w-[85%] p-5 rounded-2xl 
        text-black bg-white
        break-words whitespace-pre-wrap border-2 border-[#a6ce39]
      ">
        {text}

        {/* Bot Bubble tail border */}
        <span
          className="
            absolute
            -bottom-[7px]
            left-4
            w-3
            h-3
            bg-[#a6ce39]
            rotate-45
          "
        />

        {/* Bot Bubble tail fill - masks the border above to create the hollow tail */}
        <span
          className="
            absolute
            -bottom-[4px]
            left-4
            w-3
            h-3
            bg-white
            rotate-45
          "
        />
      </div>
    </div>
  );
};

export default MessageBubble;