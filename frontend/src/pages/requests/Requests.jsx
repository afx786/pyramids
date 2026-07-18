import { useEffect, useState } from 'react';
import ConnectionCard from '../../components/common/ConnectionCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { connectionService } from '../../services/connectionService.js';

function Requests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    connectionService.listIncomingRequests().then(setRequests).catch((err) => setError(err.message));
  }, []);

  async function handleAccept(req) {
    try {
      await connectionService.acceptRequest(req.id);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    } catch (err) { setError(err.message); }
  }

  async function handleReject(req) {
    try {
      await connectionService.rejectRequest(req.id);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    } catch (err) { setError(err.message); }
  }

  const people = requests.map((req) => ({
    id: req.id,
    name: req.sender?.name ?? 'Unknown',
    role: req.sender?.headline || 'Wants to connect',
    avatar: req.sender?.profile_picture,
    skills: [],
  }));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Invites"
        title="Requests"
        description="Review connection requests from other builders."
      />

      {error && (
        <div className="mb-5 border border-red-200 bg-red-50 px-5 py-3 rounded-lg">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      <section className="mt-10 grid grid-cols-2 gap-5">
        {people.length > 0 ? (
          people.map((person) => (
            <ConnectionCard
              key={person.id}
              person={person}
              primaryAction="Accept"
              secondaryAction="Decline"
              onPrimary={() => handleAccept(person)}
              onSecondary={() => handleReject(person)}
            />
          ))
        ) : (
          <div className="col-span-2">
            <EmptyState title="No requests yet" description="Incoming connection requests will appear here." />
          </div>
        )}
      </section>
    </div>
  );
}

export default Requests;
