import { Send } from 'lucide-react';
import { useState } from 'react';
import ConversationListItem from '../../components/common/ConversationListItem.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import MessageBubble from '../../components/common/MessageBubble.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import { conversations } from '../../data/mockData.js';

function Messages() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const activeConversation = conversations.find((conversation) => conversation.id === activeId);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Keep collaboration conversations focused around projects, skills, and next steps."
      />

      <section className="mt-10 grid h-[620px] grid-cols-[320px_1fr] gap-6">
        <Card className="overflow-hidden p-4">
          <h2 className="px-2 pb-4 text-lg font-black text-primary">Connections</h2>
          <div className="space-y-2">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <ConversationListItem
                  key={conversation.id}
                  conversation={conversation}
                  active={conversation.id === activeId}
                  onClick={() => setActiveId(conversation.id)}
                />
              ))
            ) : (
              <EmptyState title="No messages" description="Your project conversations will appear here." />
            )}
          </div>
        </Card>

        <Card className="flex min-h-0 flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-subtle p-5">
            <Avatar src={activeConversation.avatar} alt={activeConversation.user} size="sm" />
            <div>
              <h2 className="font-black text-primary">{activeConversation.user}</h2>
              <p className="text-sm font-medium text-secondary">Project collaborator</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {activeConversation.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>

          <div className="flex items-center gap-3 border-t border-subtle p-5">
            <Input placeholder="Write a message" />
            <Button className="shrink-0">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default Messages;
