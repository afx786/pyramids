import { useEffect, useState } from 'react';
import ConnectionCard from '../../components/common/ConnectionCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { connectionService } from '../../services/connectionService.js';

const tabs = [
  { id: 'connected', label: 'Connected' },
  { id: 'pending', label: 'Pending' },
  { id: 'sent', label: 'Sent' },
];

function Connections() {
  const [activeTab, setActiveTab] = useState('connected');
  const [connected, setConnected] = useState([]);
  const [pending, setPending] = useState([]);
  const [sent, setSent] = useState([]);

  useEffect(() => {
    connectionService.listConnections().then(setConnected).catch(() => {});
    connectionService.listIncomingRequests().then(setPending).catch(() => {});
    connectionService.listOutgoingRequests().then(setSent).catch(() => {});
  }, []);

  const dataMap = {
    connected: connected.map((conn) => ({
      id: conn.id,
      name: conn.user.name,
      role: conn.user.headline || 'Builder',
      avatar: conn.user.profile_picture,
      skills: [],
    })),
    pending: pending.map((req) => ({
      id: req.id,
      name: req.sender?.name ?? 'Unknown',
      role: req.sender?.headline || 'Sent you a request',
      avatar: req.sender?.profile_picture,
      skills: [],
      _requestId: req.id,
    })),
    sent: sent.map((req) => ({
      id: req.id,
      name: req.receiver?.name ?? 'Unknown',
      role: req.receiver?.headline || 'Awaiting response',
      avatar: req.receiver?.profile_picture,
      skills: [],
      _requestId: req.id,
    })),
  };

  const people = dataMap[activeTab];

  async function handleAccept(person) {
    try {
      await connectionService.acceptRequest(person._requestId);
      setPending((prev) => prev.filter((r) => r.id !== person._requestId));
    } catch {}
  }

  async function handleReject(person) {
    try {
      await connectionService.rejectRequest(person._requestId);
      setPending((prev) => prev.filter((r) => r.id !== person._requestId));
    } catch {}
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Network"
        title="Connections"
        description="Manage builders you are connected with, incoming requests, and invites you have sent."
      />

      <div className="mt-10 flex gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`rounded-lg px-5 py-3 text-sm font-black transition ${
              activeTab === tab.id ? 'bg-primary text-app' : 'bg-surface text-primary'
            }`}
            type="button"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="mt-8 grid grid-cols-3 gap-5">
        {people.length > 0 ? (
          people.map((person) => (
            <ConnectionCard
              key={person.id}
              person={person}
              primaryAction={
                activeTab === 'pending' ? 'Accept' : activeTab === 'sent' ? 'Sent' : 'Message'
              }
              secondaryAction={activeTab === 'pending' ? 'Ignore' : undefined}
              onPrimary={activeTab === 'pending' ? () => handleAccept(person) : undefined}
              onSecondary={activeTab === 'pending' ? () => handleReject(person) : undefined}
            />
          ))
        ) : (
          <div className="col-span-3">
            <EmptyState title="No connections here yet" description="This tab will show connections once they exist." />
          </div>
        )}
      </section>
    </div>
  );
}

export default Connections;
