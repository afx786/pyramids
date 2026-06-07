import ConnectionCard from '../../components/common/ConnectionCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { requests } from '../../data/mockData.js';

function Requests() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Invites"
        title="Requests"
        description="Review collaboration requests from students who want to join projects, build teams, or connect around shared skills."
      />

      <section className="mt-10 grid grid-cols-2 gap-5">
        {requests.length > 0 ? (
          requests.map((request) => (
            <ConnectionCard key={request.id} person={request} primaryAction="Accept" secondaryAction="Decline" />
          ))
        ) : (
          <div className="col-span-2">
            <EmptyState title="No requests yet" description="Incoming collaboration requests will appear here." />
          </div>
        )}
      </section>
    </div>
  );
}

export default Requests;
