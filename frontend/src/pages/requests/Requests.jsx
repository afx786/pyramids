import { useEffect, useState } from 'react';
import ConnectionCard from '../../components/common/ConnectionCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
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
    joining_year: req.sender?.joining_year,
    graduating_year: req.sender?.graduating_year,
    skills: [],
  }));

  return (
    <div className="p-xl max-w-6xl mx-auto">
      <header className="mb-xl">
        <h2 className="font-display-serif text-display-serif" style={{ color: 'rgb(var(--color-primary))' }}>Requests</h2>
        <p className="font-body-lg text-body-lg mt-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Review connection requests from other builders.
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

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
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
          <div className="col-span-full">
            <EmptyState title="No requests yet" description="Incoming connection requests will appear here." />
          </div>
        )}
      </section>
    </div>
  );
}

export default Requests;
