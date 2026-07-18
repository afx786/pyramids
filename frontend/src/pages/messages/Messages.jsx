import { Send, Trash2, UserPlus } from 'lucide-react';
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
import { connectionService } from '../../services/connectionService.js';
import { messageService } from '../../services/messageService.js';

function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [connections, setConnections] = useState([]);
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

  async function handleDeleteMessage(msgId) {
    try {
      await messageService.deleteMessage(msgId);
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
    } catch {}
  }

  async function handleDeleteConversation(convId) {
    try {
      await messageService.deleteConversation(convId);
      setConversations((prev) => {
        const next = prev.filter((c) => c.conversation_id !== convId);
        if (activeId === convId) {
          setActiveId(next.length > 0 ? next[0].conversation_id : null);
          setMessages([]);
        }
        return next;
      });
    } catch {}
  }

  async function handleStartConversation(userId) {
    try {
      const conv = await messageService.startConversation(userId);
      setConversations((prev) => {
        const exists = prev.find((c) => c.conversation_id === conv.conversation_id);
        return exists ? prev : [conv, ...prev];
      });
      setActiveId(conv.conversation_id);
      setShowNewChat(false);
    } catch {}
  }

  function openNewChat() {
    connectionService.listConnections().then(setConnections).catch(() => {});
    setShowNewChat(true);
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
        <Card className="flex flex-col overflow-hidden p-4">
          <div className="flex items-center justify-between px-2 pb-4">
            <h2 className="text-lg font-black text-primary">Conversations</h2>
            <button type="button" onClick={openNewChat} className="flex items-center gap-1 text-sm font-semibold text-primary">
              <UserPlus className="h-4 w-4" />
              New
            </button>
          </div>

          {showNewChat && (
            <div className="mb-4 rounded-lg border border-subtle p-3">
              <p className="mb-2 text-xs font-bold text-secondary">Select a connection</p>
              <div className="max-h-32 space-y-1 overflow-y-auto">
                {connections
                  .filter((c) => c.user?.id !== activeConversation?.other_user?.id)
                  .map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleStartConversation(c.user.id)}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent-soft"
                    >
                      <Avatar src={c.user.profile_picture} alt={c.user.name} size="sm" />
                      <span className="font-medium text-primary">{c.user.name}</span>
                    </button>
                  ))}
                {connections.length === 0 && <p className="text-xs text-secondary">No connections yet.</p>}
              </div>
              <button type="button" onClick={() => setShowNewChat(false)} className="mt-2 text-xs font-semibold text-secondary">Cancel</button>
            </div>
          )}

          <div className="flex-1 space-y-2 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <div key={conv.conversation_id} className="group relative">
                  <ConversationListItem
                    conversation={{
                      id: conv.conversation_id,
                      user: conv.other_user.name,
                      avatar: null,
                      preview: conv.last_message || '—',
                    }}
                    active={conv.conversation_id === activeId}
                    onClick={() => setActiveId(conv.conversation_id)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteConversation(conv.conversation_id)}
                    className="absolute right-1 top-1 hidden p-1 text-secondary hover:text-red-500 group-hover:block"
                    title="Delete conversation"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))
            ) : (
              <EmptyState title="No messages" description="Start a conversation with a connection." />
            )}
          </div>
        </Card>

        {activeConversation ? (
          <Card className="flex min-h-0 flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-subtle p-5">
              <div className="flex items-center gap-3">
                <Avatar src={null} alt={activeConversation.other_user.name} size="sm" />
                <div>
                  <h2 className="font-black text-primary">{activeConversation.other_user.name}</h2>
                  <p className="text-sm font-medium text-secondary">Project collaborator</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((msg) => (
                <div key={msg.id} className="group relative">
                  <MessageBubble
                    message={{
                      id: msg.id,
                      text: msg.content,
                      mine: msg.sender_id === user?.id,
                    }}
                  />
                  {msg.sender_id === user?.id && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="absolute -right-1 -top-1 hidden rounded-full bg-red-100 p-1 text-red-500 hover:bg-red-200 group-hover:block"
                      title="Delete message"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
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
