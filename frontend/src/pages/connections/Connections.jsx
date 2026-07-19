import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectionCard from '../../components/common/ConnectionCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import InfiniteScroll from '../../components/ui/InfiniteScroll.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { SkeletonAvatar, SkeletonLine } from '../../components/ui/Skeleton.jsx';
import Card from '../../components/ui/Card.jsx';
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
    <div className="mx-auto max-w-6xl animate-fade-in">
      <PageHeader
        eyebrow="Network"
        title="Connections"
        description="Manage builders you are connected with, incoming requests, and invites you have sent."
      />

      {error && (
        <div className="mt-5 rounded-lg border px-5 py-3" style={{ borderColor: 'rgb(var(--color-danger) / 0.3)', background: 'rgb(var(--color-danger) / 0.08)' }}>
          <p className="text-sm font-semibold" style={{ color: 'rgb(var(--color-danger))' }}>{error}</p>
        </div>
      )}

      <div className="mt-10 flex gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className="rounded-xl px-5 py-3 text-sm font-black transition-all duration-200 btn-press"
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={
              activeTab === tab.id
                ? {
                    background: 'rgb(var(--color-elevated))',
                    color: 'rgb(var(--color-text-primary))',
                    border: '1px solid rgb(var(--color-border-subtle))',
                    border: 'none',
                  }
                : {
                    background: 'rgb(var(--color-glass))',
                    color: 'rgb(var(--color-text-primary))',
                    border: '1px solid rgb(var(--color-glass-border))',
                  }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="stagger mt-8 grid grid-cols-3 gap-5">
        {loadingTabs[activeTab] ? (
          [1,2,3,4,5,6].map((i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center gap-4">
                <SkeletonAvatar size="md" />
                <div className="flex-1 space-y-2">
                  <SkeletonLine width="60%" />
                  <SkeletonLine width="40%" />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <InfiniteScroll onLoadMore={() => {}} hasMore={false} loading={false}>
          {people.length > 0 ? (
          people.map((person) => (
            <div key={person.id} className="relative">
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
          <div className="col-span-3">
            <EmptyState title={`No ${activeTab} connections yet`} description={`${activeTab === 'connected' ? 'Connect with builders to grow your network.' : activeTab === 'pending' ? 'Incoming requests will appear here.' : 'Sent requests will appear here.'}`} />
          </div>
        )}
          </InfiniteScroll>
        )}
      </section>
    </div>
  );
}

export default Connections;
