import Avatar from '../ui/Avatar.jsx';

function ConversationListItem({ conversation, active, onClick }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
        active ? 'bg-surface text-primary' : 'hover:bg-surface/70'
      }`}
      type="button"
      onClick={onClick}
    >
      <Avatar src={conversation.avatar} alt={conversation.user} size="sm" />
      <div className="min-w-0">
        <p className="font-black text-primary">{conversation.user}</p>
        <p className="truncate text-sm font-medium text-secondary">{conversation.preview}</p>
      </div>
    </button>
  );
}

export default ConversationListItem;
