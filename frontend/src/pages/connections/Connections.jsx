import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, X } from 'lucide-react';
import ConnectionCard from '../../components/common/ConnectionCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
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
  const [error, setError] = useState('');

  useEffect(() => {
    connectionService.listConnections().then(setConnected).catch((err) => setError(err.message));
    connectionService.listIncomingRequests().then(setPending).catch((err) => setError(err.message));
    connectionService.listOutgoingRequests().then(setSent).catch((err) => setError(err.message));
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

  async function handleAccept(person) {
    try {
      await connectionService.acceptRequest(person._requestId);
      setPending((prev) => prev.filter((r) => r.id !== person._requestId));
    } catch (err) { setError(err.message); }
  }

  async function handleReject(person) {
    try {
      await connectionService.rejectRequest(person._requestId);
      setPending((prev) => prev.filter((r) => r.id !== person._requestId));
    } catch (err) { setError(err.message); }
  }

  async function handleCancel(person) {
    try {
      await connectionService.cancelRequest(person._requestId);
      setSent((prev) => prev.filter((r) => r.id !== person._requestId));
    } catch (err) { setError(err.message); }
  }

  async function handleRemove(person) {
    try {
      await connectionService.removeConnection(person._connectionId);
      setConnected((prev) => prev.filter((c) => c.id !== person._connectionId));
    } catch (err) { setError(err.message); }
  }

  async function handleMessage(person) {
    try {
      await messageService.startConversation(person._userId || person.id);
      navigate('/messages');
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Network"
        title="Connections"
        description="Manage builders you are connected with, incoming requests, and invites you have sent."
      />

      {error && (
        <div className="mt-5 border border-red-200 bg-red-50 px-5 py-3 rounded-lg">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-10 flex gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`rounded-lg px-5 py-3 text-sm font-black transition ${
              activeTab === tab.id ? 'bg-primary text-app' : 'bg-surface text-primary border border-subtle'
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
      </section>
    </div>
  );
}

export default Connections;
