import { useEffect, useState } from 'react';
import ConnectionCard from '../../components/common/ConnectionCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { connectionService } from '../../services/connectionService.js';

function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    connectionService.listIncomingRequests().then(setRequests).catch(() => {});
  }, []);

  async function handleAccept(req) {
    try {
      await connectionService.acceptRequest(req.id);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    } catch {}
  }

  async function handleReject(req) {
    try {
      await connectionService.rejectRequest(req.id);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    } catch {}
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
