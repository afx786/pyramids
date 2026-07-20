import { Send, Trash2, UserPlus, MessageSquare } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ConversationListItem from '../../components/common/ConversationListItem.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import MessageBubble from '../../components/common/MessageBubble.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
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
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const loadConversations = useCallback(() => {
    setConversationsLoading(true);
    messageService.listConversations().then((data) => {
      const list = Array.isArray(data) ? data : (data?.items ?? []);
      setConversations(list);
    }).catch((err) => setError(err.message)).finally(() => setConversationsLoading(false));
  }, []);

  useEffect(() => {
    loadConversations();
    setConnectionsLoading(true);
    connectionService.listConnections().then((data) => {
      setConnections(data);
      setConnectionsLoading(false);
    }).catch((err) => {
      setError(err.message);
      setConnectionsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!activeId) return;
    setError('');
    setMessagesLoading(true);
    messageService.getMessages(activeId).then(setMessages).catch((err) => setError(err.message)).finally(() => setMessagesLoading(false));
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const tempIdRef = useRef(0);

  function handleSend() {
    if (!text.trim() || !activeId) return;
    setError('');
    const tempId = --tempIdRef.current;
    const content = text.trim();
    setText('');
    const optimistic = {
      id: tempId,
      conversation_id: activeId,
      sender_id: user?.id,
      content,
      created_at: new Date().toISOString(),
      _sending: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    messageService.sendMessage(activeId, content).then((msg) => {
      setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...msg, _sending: false } : m)));
    }).catch(() => {
      setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, _sending: false, _failed: true } : m)));
    });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleDeleteMessage(msgId) {
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
    if (msgId < 0) return;
    try {
      await messageService.deleteMessage(msgId);
    } catch {}
  }

  function retrySend(msg) {
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, _sending: true, _failed: false } : m)));
    messageService.sendMessage(msg.conversation_id, msg.content).then((real) => {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...real, _sending: false } : m)));
    }).catch(() => {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, _sending: false, _failed: true } : m)));
    });
  }

  function handleDeleteConversation(convId) {
    setConversations((prev) => {
      const next = prev.filter((c) => c.conversation_id !== convId);
      if (activeId === convId) {
        setActiveId(next.length > 0 ? next[0].conversation_id : null);
        setMessages([]);
      }
      return next;
    });
    messageService.deleteConversation(convId).catch(() => {});
  }

  async function handleStartConversation(userId) {
    setError('');
    try {
      const conv = await messageService.startConversation(userId);
      const otherUser = connections.find((c) => c.user?.id === userId)?.user || { id: userId, name: 'User' };
      const newConv = {
        conversation_id: conv.id,
        other_user: { id: otherUser.id, name: otherUser.name },
        last_message: null,
        last_message_time: null,
        unread_count: 0,
      };
      setConversations((prev) => {
        const exists = prev.find((c) => c.conversation_id === newConv.conversation_id);
        return exists ? prev : [newConv, ...prev];
      });
      setActiveId(conv.id);
      setShowNewChat(false);
    } catch (err) { setError(err.message); }
  }

  function openNewChat() { setShowNewChat(true); }

  const activeConversation = conversations.find((c) => c.conversation_id === activeId);

  return (
    <div className="p-xl max-w-6xl mx-auto">
      <header className="mb-xl">
        <h2 className="font-display-serif text-display-serif" style={{ color: 'rgb(var(--color-primary))' }}>Messages</h2>
        <p className="font-body-lg text-body-lg mt-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Keep collaboration conversations focused around projects, skills, and next steps.
        </p>
      </header>

      {error ? (
        <div
          className="mb-xl rounded-lg px-lg py-sm font-body-sm font-semibold"
          style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}
        >
          {error}
        </div>
      ) : null}

      <section className="grid h-[620px] grid-cols-1 lg:grid-cols-[320px_1fr] gap-lg">
        <div
          className="flex flex-col overflow-hidden rounded-xl p-md"
          style={{
            background: 'rgb(var(--color-surface-container-low))',
            border: '1px solid rgb(var(--color-outline-variant))',
          }}
        >
          <div className="flex items-center justify-between px-sm pb-md">
            <h3 className="font-headline-md text-headline-md" style={{ color: 'rgb(var(--color-primary))' }}>Conversations</h3>
            <button
              type="button"
              onClick={openNewChat}
              className="flex items-center gap-1 font-body-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: 'rgb(var(--color-primary))' }}
            >
              <UserPlus size={16} />
              New
            </button>
          </div>

          {showNewChat ? (
            <div
              className="mb-md rounded-xl p-md"
              style={{
                background: 'rgb(var(--color-surface-container))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <p className="mb-sm font-body-sm font-bold" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                Select a connection
              </p>
              <div className="max-h-32 space-y-1 overflow-y-auto">
                {connectionsLoading ? (
                  <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Loading connections...</p>
                ) : (
                  <>
                    {connections
                      .filter((c) => c.user?.id !== activeConversation?.other_user?.id)
                      .map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleStartConversation(c.user.id)}
                          className="flex w-full items-center gap-2 rounded-md px-md py-sm text-left font-body-sm transition-all"
                          style={{ color: 'rgb(var(--color-on-surface))' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgb(var(--color-surface-container-high))'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Avatar src={c.user.profile_picture} alt={c.user.name} size="sm" />
                          <span className="font-medium">{c.user.name}</span>
                        </button>
                      ))}
                    {!connectionsLoading && connections.length === 0 ? (
                      <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No connections yet.</p>
                    ) : null}
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowNewChat(false)}
                className="mt-sm font-body-sm font-semibold"
                style={{ color: 'rgb(var(--color-on-surface-variant))' }}
              >
                Cancel
              </button>
            </div>
          ) : null}

          <div className="flex-1 space-y-sm overflow-y-auto">
            {conversationsLoading ? (
              <div className="space-y-md p-sm">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-md">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-3/5" />
                      <Skeleton className="h-3 w-2/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((conv) => (
                <div key={conv.conversation_id} className="group relative">
                  <ConversationListItem
                    conversation={{
                      id: conv.conversation_id,
                      user: conv.other_user?.name || 'Unknown',
                      avatar: null,
                      preview: conv.last_message || '—',
                    }}
                    active={conv.conversation_id === activeId}
                    onClick={() => setActiveId(conv.conversation_id)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteConversation(conv.conversation_id)}
                    className="absolute right-sm top-1 hidden p-xs group-hover:block transition-opacity hover:opacity-60"
                    style={{ color: 'rgb(var(--color-error))' }}
                    title="Delete conversation"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            ) : (
              <EmptyState
                title="No messages"
                description="Start a conversation with a connection."
              />
            )}
          </div>
        </div>

        {activeConversation ? (
          <div
            className="flex min-h-0 flex-col overflow-hidden rounded-xl"
            style={{
              background: 'rgb(var(--color-surface-container-low))',
              border: '1px solid rgb(var(--color-outline-variant))',
            }}
          >
            <div
              className="flex items-center justify-between p-lg"
              style={{ borderBottom: '1px solid rgb(var(--color-outline-variant))' }}
            >
              <div className="flex items-center gap-md">
                <Avatar src={null} alt={activeConversation.other_user?.name || 'User'} size="sm" />
                <div>
                  <h3 className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
                    {activeConversation.other_user?.name || 'User'}
                  </h3>
                  <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Project collaborator</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-lg overflow-y-auto p-xl">
              {messagesLoading ? (
                <div className="space-y-lg">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`flex items-start gap-md ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                      <Skeleton className={`h-16 ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'} rounded-xl`} />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`group relative ${msg._failed ? 'opacity-60' : ''}`}>
                      <MessageBubble
                        message={{
                          id: msg.id,
                          text: msg.content,
                          mine: msg.sender_id === user?.id,
                        }}
                      />
                      <div className="flex items-center gap-sm mt-xs">
                        {msg._sending ? (
                          <span className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Sending...</span>
                        ) : null}
                        {msg._failed ? (
                          <button
                            type="button"
                            onClick={() => retrySend(msg)}
                            className="font-body-sm font-semibold hover:underline"
                            style={{ color: 'rgb(var(--color-error))' }}
                          >
                            Retry
                          </button>
                        ) : null}
                        {msg.sender_id === user?.id && !msg._sending ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="font-body-sm opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100"
                            style={{ color: 'rgb(var(--color-on-surface-variant))' }}
                            title="Delete message"
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </>
              )}
              <div ref={bottomRef} />
            </div>

            <div
              className="flex items-center gap-md p-lg"
              style={{ borderTop: '1px solid rgb(var(--color-outline-variant))' }}
            >
              <div className="flex-1">
                <Input
                  placeholder="Write a message"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button className="shrink-0" onClick={handleSend}>
                <Send size={16} />
                Send
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              background: 'rgb(var(--color-surface-container-low))',
              border: '1px solid rgb(var(--color-outline-variant))',
            }}
          >
            <div className="text-center">
              <MessageSquare size={48} style={{ color: 'rgb(var(--color-on-surface-variant) / 0.3)' }} className="mx-auto mb-md" />
              <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                Select a conversation to start messaging.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Messages;
