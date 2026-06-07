import { useState } from 'react';
import ConnectionCard from '../../components/common/ConnectionCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import { connectionGroups } from '../../data/mockData.js';

const tabs = [
  { id: 'connected', label: 'Connected' },
  { id: 'pending', label: 'Pending' },
  { id: 'sent', label: 'Sent' },
];

function Connections() {
  const [activeTab, setActiveTab] = useState('connected');
  const people = connectionGroups[activeTab];

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
              primaryAction={activeTab === 'pending' ? 'Accept' : activeTab === 'sent' ? 'Sent' : 'Message'}
              secondaryAction={activeTab === 'pending' ? 'Ignore' : undefined}
            />
          ))
        ) : (
          <div className="col-span-3">
            <EmptyState
              title="No connections here yet"
              description="Once backend data is connected, empty lists from this tab will render here cleanly."
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default Connections;
