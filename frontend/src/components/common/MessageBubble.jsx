function MessageBubble({ message }) {
  return (
    <div className={`flex ${message.mine ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div
        className="max-w-[70%] rounded-lg px-md py-sm text-body-sm font-medium leading-6"
        style={
          message.mine
            ? {
                background: 'rgb(var(--color-primary))',
                color: 'rgb(var(--color-on-primary))',
                borderBottomRightRadius: '2px',
              }
            : {
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
                color: 'rgb(var(--color-on-surface))',
                borderBottomLeftRadius: '2px',
              }
        }
      >
        {message.text}
      </div>
    </div>
  );
}

export default MessageBubble;
