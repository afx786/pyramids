import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ConversationListItem from '../../components/common/ConversationListItem.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import MessageBubble from '../../components/common/MessageBubble.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { messageService } from '../../services/messageService.js';

function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    messageService.listConversations().then((data) => {
      setConversations(data);
      if (data.length > 0) setActiveId(data[0].conversation_id);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeId) return;
    messageService.getMessages(activeId).then(setMessages).catch(() => {});
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!text.trim() || !activeId) return;
    try {
      const msg = await messageService.sendMessage(activeId, text.trim());
      setMessages((prev) => [...prev, msg]);
      setText('');
    } catch {}
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const activeConversation = conversations.find((c) => c.conversation_id === activeId);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Keep collaboration conversations focused around projects, skills, and next steps."
      />

      <section className="mt-10 grid h-[620px] grid-cols-[320px_1fr] gap-6">
        <Card className="overflow-hidden p-4">
          <h2 className="px-2 pb-4 text-lg font-black text-primary">Conversations</h2>
          <div className="space-y-2">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <ConversationListItem
                  key={conv.conversation_id}
                  conversation={{
                    id: conv.conversation_id,
                    user: conv.other_user.name,
                    avatar: null,
                    preview: conv.last_message || '—',
                  }}
                  active={conv.conversation_id === activeId}
                  onClick={() => setActiveId(conv.conversation_id)}
                />
              ))
            ) : (
              <EmptyState title="No messages" description="Your project conversations will appear here." />
            )}
          </div>
        </Card>

        {activeConversation ? (
          <Card className="flex min-h-0 flex-col overflow-hidden">
            <div className="flex items-center gap-3 border-b border-subtle p-5">
              <Avatar src={null} alt={activeConversation.other_user.name} size="sm" />
              <div>
                <h2 className="font-black text-primary">{activeConversation.other_user.name}</h2>
                <p className="text-sm font-medium text-secondary">Project collaborator</p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={{
                    id: msg.id,
                    text: msg.content,
                    mine: msg.sender_id === user?.id,
                  }}
                />
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="flex items-center gap-3 border-t border-subtle p-5">
              <Input
                placeholder="Write a message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button className="shrink-0" onClick={handleSend}>
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="flex items-center justify-center">
            <p className="text-sm text-secondary">Select a conversation to start messaging.</p>
          </Card>
        )}
      </section>
    </div>
  );
}

export default Messages;
