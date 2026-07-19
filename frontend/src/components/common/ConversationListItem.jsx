import Avatar from '../ui/Avatar.jsx';

function ConversationListItem({ conversation, active, onClick }) {
  return (
    <button
      className="flex w-full items-center gap-md rounded-lg p-md text-left transition-all duration-150 btn-press"
      type="button"
      onClick={onClick}
      style={
        active
          ? {
              background: 'rgb(var(--color-surface-container-highest))',
              borderLeft: '2px solid rgb(var(--color-primary))',
            }
          : {
              background: 'transparent',
              borderLeft: '2px solid transparent',
            }
      }
    >
      <Avatar src={conversation.avatar} alt={conversation.user} size="sm" />
      <div className="min-w-0">
        <p className="font-body-sm font-semibold" style={{ color: 'rgb(var(--color-on-surface))' }}>{conversation.user}</p>
        <p className="truncate font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{conversation.preview}</p>
      </div>
    </button>
  );
}

export default ConversationListItem;
