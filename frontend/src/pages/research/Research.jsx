import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import { api } from '../../services/api.js';

function Research() {
  const [researchList, setResearchList] = useState([]);

  useEffect(() => {
    api.get('/research').then(setResearchList).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Research"
        title="Research Projects"
        description="Academic and collaborative research projects on campus."
      />

      <section className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {researchList.length > 0 ? (
          researchList.map((r) => (
            <Link key={r.id} to={`/research/${r.id}`} className="block">
              <Card className="p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                <h2 className="text-xl font-black text-primary">{r.title}</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-secondary line-clamp-3">{r.description}</p>
                <p className="mt-4 text-sm font-semibold text-secondary">{r.domain || '—'}</p>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState title="No research projects yet" description="Research projects will appear here." />
          </div>
        )}
      </section>
    </div>
  );
}

export default Research;
