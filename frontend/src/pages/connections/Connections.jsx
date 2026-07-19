import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectionCard from '../../components/common/ConnectionCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { connectionService } from '../../services/connectionService.js';
import { messageService } from '../../services/messageService.js';

const tabs = [
  { id: 'connected', label: 'Connected' },
  { id: 'pending', label: 'Pending' },
  { id: 'sent', label: 'Sent' },
];

function Connections() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('connected');
  const [connected, setConnected] = useState([]);
  const [pending, setPending] = useState([]);
  const [sent, setSent] = useState([]);
  const [loadingTabs, setLoadingTabs] = useState({ connected: true, pending: true, sent: true });
  const [error, setError] = useState('');

  useEffect(() => {
    connectionService.listConnections().then((data) => { setConnected(data); setLoadingTabs((p) => ({ ...p, connected: false })); }).catch((err) => { setError(err.message); setLoadingTabs((p) => ({ ...p, connected: false })); });
    connectionService.listIncomingRequests().then((data) => { setPending(data); setLoadingTabs((p) => ({ ...p, pending: false })); }).catch((err) => { setError(err.message); setLoadingTabs((p) => ({ ...p, pending: false })); });
    connectionService.listOutgoingRequests().then((data) => { setSent(data); setLoadingTabs((p) => ({ ...p, sent: false })); }).catch((err) => { setError(err.message); setLoadingTabs((p) => ({ ...p, sent: false })); });
  }, []);

  function mapConnected(conn) {
    const user = conn.user || conn;
    return {
      id: user.id || conn.id,
      _connectionId: conn.id,
      _userId: user.id,
      name: user.name || 'Unknown',
      role: user.headline || 'Builder',
      avatar: user.profile_picture,
      skills: [],
    };
  }

  function mapRequest(req, role) {
    const person = role === 'sender' ? (req.sender || req) : (req.receiver || req);
    return {
      id: req.id,
      _requestId: req.id,
      name: person.name || 'Unknown',
      role: person.headline || (role === 'sender' ? 'Wants to connect' : 'Awaiting response'),
      avatar: person.profile_picture,
      skills: [],
    };
  }

  const dataMap = {
    connected: connected.map(mapConnected),
    pending: pending.map((r) => ({ ...mapRequest(r, 'sender'), _requestId: r.id })),
    sent: sent.map((r) => ({ ...mapRequest(r, 'receiver'), _requestId: r.id })),
  };

  const people = dataMap[activeTab];

  function handleAccept(person) {
    setPending((prev) => prev.filter((r) => r.id !== person._requestId));
    connectionService.acceptRequest(person._requestId).catch((err) => setError(err.message));
  }

  function handleReject(person) {
    setPending((prev) => prev.filter((r) => r.id !== person._requestId));
    connectionService.rejectRequest(person._requestId).catch((err) => setError(err.message));
  }

  function handleCancel(person) {
    setSent((prev) => prev.filter((r) => r.id !== person._requestId));
    connectionService.cancelRequest(person._requestId).catch((err) => setError(err.message));
  }

  function handleRemove(person) {
    setConnected((prev) => prev.filter((c) => c.id !== person._connectionId));
    connectionService.removeConnection(person._connectionId).catch((err) => setError(err.message));
  }

  function handleMessage(person) {
    navigate('/messages');
    messageService.startConversation(person._userId || person.id).catch(() => {});
  }

  return (
    <div className="p-xl max-w-6xl mx-auto">
      <header className="mb-xl">
        <h2 className="font-display-serif text-display-serif" style={{ color: 'rgb(var(--color-primary))' }}>Connections</h2>
        <p className="font-body-lg text-body-lg mt-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Manage builders you are connected with, incoming requests, and invites you have sent.
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

      <div className="flex gap-md mb-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="px-lg py-sm rounded-lg font-bold transition-all"
            style={{
              background: activeTab === tab.id ? 'rgb(var(--color-primary))' : 'rgb(var(--color-surface-container))',
              color: activeTab === tab.id ? 'rgb(var(--color-on-primary))' : 'rgb(var(--color-on-surface))',
              border: activeTab === tab.id ? 'none' : '1px solid rgb(var(--color-outline-variant))',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
        {loadingTabs[activeTab] ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-lg rounded-xl space-y-md"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <div className="flex items-center gap-md">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-3 w-2/5" />
                </div>
              </div>
            </div>
          ))
        ) : people.length > 0 ? (
          people.map((person) => (
            <div key={person.id}>
              <ConnectionCard
                person={person}
                primaryAction={
                  activeTab === 'pending' ? 'Accept' : activeTab === 'sent' ? 'Cancel' : 'Message'
                }
                secondaryAction={
                  activeTab === 'pending' ? 'Ignore' : undefined
                }
                onPrimary={
                  activeTab === 'pending' ? () => handleAccept(person) :
                  activeTab === 'sent' ? () => handleCancel(person) :
                  activeTab === 'connected' ? () => handleMessage(person) : undefined
                }
                onSecondary={activeTab === 'pending' ? () => handleReject(person) : undefined}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState
              title={`No ${activeTab} connections yet`}
              description={`${activeTab === 'connected' ? 'Connect with builders to grow your network.' : activeTab === 'pending' ? 'Incoming requests will appear here.' : 'Sent requests will appear here.'}`}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default Connections;
