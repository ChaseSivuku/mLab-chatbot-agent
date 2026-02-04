

interface MessageProps {
  text: string;
  sender: 'user' | 'bot';
  isSpecial?: boolean; 
}

const MessageBubble = ({ text, sender, isSpecial }: MessageProps) => {
  if (sender === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-[#a6ce39] text-black px-6 py-3 rounded-2xl max-w-[80%] shadow-sm">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-4 max-w-[85%] p-5 rounded-2xl ${
      isSpecial ? 'border border-[#a6ce39] bg-white shadow-sm' : 'text-black'
    }`}>
      {text}
    </div>
  );
};

export default MessageBubble;