import { Send, Trash2, UserPlus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ConversationListItem from '../../components/common/ConversationListItem.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import MessageBubble from '../../components/common/MessageBubble.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Skeleton, { SkeletonAvatar, SkeletonLine } from '../../components/ui/Skeleton.jsx';
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
      if (!activeId && list.length > 0) setActiveId(list[0].conversation_id);
    }).catch((err) => setError(err.message)).finally(() => setConversationsLoading(false));
  }, [activeId]);

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

  let _tempId = 0;
  function nextTempId() { return --_tempId; }

  function handleSend() {
    if (!text.trim() || !activeId) return;
    setError('');
    const tempId = nextTempId();
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

  function openNewChat() {
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

      {error && (
        <div className="mt-5 border border-red-200 bg-red-50 px-5 py-3 rounded-lg">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

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
                {connectionsLoading ? (
                  <p className="text-xs font-medium text-secondary">Loading connections...</p>
                ) : (
                  <>
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
                    {!connectionsLoading && connections.length === 0 && <p className="text-xs text-secondary">No connections yet.</p>}
                  </>
                )}
              </div>
              <button type="button" onClick={() => setShowNewChat(false)} className="mt-2 text-xs font-semibold text-secondary">Cancel</button>
            </div>
          )}

          <div className="flex-1 space-y-2 overflow-y-auto">
            {conversationsLoading ? (
              <div className="space-y-3 p-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <SkeletonAvatar size="sm" />
                    <div className="flex-1 space-y-1.5">
                      <SkeletonLine width="60%" />
                      <SkeletonLine width="40%" />
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
                <Avatar src={null} alt={activeConversation.other_user?.name || 'User'} size="sm" />
                <div>
                  <h2 className="font-black text-primary">{activeConversation.other_user?.name || 'User'}</h2>
                  <p className="text-sm font-medium text-secondary">Project collaborator</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messagesLoading ? (
                <div className="space-y-4">
                  {[1,2,3].map((i) => (
                    <div key={i} className={`flex items-start gap-3 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                      <SkeletonAvatar size="sm" />
                      <Skeleton className={`h-16 ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'}`} />
                    </div>
                  ))}
                </div>
              ) : messages.map((msg) => (
                <div key={msg.id} className={`group relative ${msg._failed ? 'opacity-60' : ''}`}>
                  <MessageBubble
                    message={{
                      id: msg.id,
                      text: msg.content,
                      mine: msg.sender_id === user?.id,
                    }}
                  />
                  {msg._sending && <span className="ml-2 text-xs text-secondary">Sending...</span>}
                  {msg._failed && (
                    <button type="button" onClick={() => retrySend(msg)} className="ml-2 text-xs font-semibold text-red-500 hover:underline">Retry</button>
                  )}
                  {msg.sender_id === user?.id && !msg._sending && (
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
