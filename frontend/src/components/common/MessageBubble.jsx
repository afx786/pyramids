function MessageBubble({ message }) {
  return (
    <div className={`flex ${message.mine ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div
        className="max-w-[70%] rounded-2xl px-4 py-3 text-sm font-semibold leading-6 shadow-lg"
        style={
          message.mine
            ? {
                background: 'linear-gradient(135deg, rgb(var(--color-accent)), rgb(80 60 255))',
                color: 'white',
                borderBottomRightRadius: '4px',
              }
            : {
                background: 'rgb(var(--color-glass))',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgb(var(--color-glass-border))',
                color: 'rgb(var(--color-text-primary))',
                borderBottomLeftRadius: '4px',
              }
        }
      >
        {message.text}
      </div>
    </div>
  );
}

export default MessageBubble;
