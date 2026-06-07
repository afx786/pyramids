function MessageBubble({ message }) {
  return (
    <div className={`flex ${message.mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-3 text-sm font-semibold leading-6 ${
          message.mine ? 'bg-primary text-app' : 'bg-surface text-primary'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

export default MessageBubble;
