interface MessageProps {
  text: string;
  sender: "user" | "bot";
  isSpecial?: boolean;
}

const MessageBubble = ({ text, sender, isSpecial }: MessageProps) => {
  if (sender === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="relative bg-[#a6ce39] text-black px-6 py-2 rounded-2xl max-w-[80%] shadow-sm">
          {text}

          {/* User Bubble tail */}
          <span
            className="
              absolute
              bottom-[-6px]
              right-4
              w-3
              h-3
              bg-[#a6ce39]
              rotate-45
            "
          />
        </div>
      </div>
    );
  }

  // BOT MESSAGE
  return (
    <div
      className={`
        relative
        mb-4
        max-w-[85%]
        p-4
        rounded-2xl
        bg-white
        text-black
        border
        border-[#a6ce39]
        shadow-sm
        ${isSpecial ? "bg-[#f7fbe9]" : ""}
      `}
    >
      {text}

      {/* Bot Bubble tail border */}
      <span
        className="
          absolute
          bottom-[-7px]
          left-4
          w-3
          h-3
          bg-[#a6ce39]
          rotate-45
        "
      />

      {/* Bot Bubble tail fill */}
      <span
        className="
          absolute
          bottom-[-6px]
          left-4
          w-3
          h-3
          bg-white
          rotate-45
        "
      />
    </div>
  );
};

export default MessageBubble;
