import Avatar from '../ui/Avatar.jsx';

function ConversationListItem({ conversation, active, onClick }) {
  return (
    <button
      className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 btn-press"
      type="button"
      onClick={onClick}
      style={
        active
          ? {
              background: 'rgb(var(--color-accent) / 0.1)',
              border: '1px solid rgb(var(--color-accent) / 0.2)',
            }
          : {
              background: 'transparent',
              border: '1px solid transparent',
            }
      }
    >
      <Avatar src={conversation.avatar} alt={conversation.user} size="sm" />
      <div className="min-w-0">
        <p className="font-black">{conversation.user}</p>
        <p className="truncate text-sm font-medium text-secondary">{conversation.preview}</p>
      </div>
    </button>
  );
}

export default ConversationListItem;
