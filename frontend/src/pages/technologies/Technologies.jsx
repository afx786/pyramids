import { useEffect, useState } from 'react';
import { Code2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { api } from '../../services/api.js';

function Technologies() {
  const [technologies, setTechnologies] = useState([]);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    api.get('/technologies').then(setTechnologies).catch(() => {});
  }, []);

  const categories = ['all', ...new Set(technologies.map((t) => t.category).filter(Boolean))];
  const filtered = category === 'all' ? technologies : technologies.filter((t) => t.category === category);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Tools"
        title="Technologies"
        description="Browse technologies and tools used across the platform."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-lg px-4 py-2 text-sm font-bold capitalize transition ${
              category === c ? 'bg-primary text-app' : 'bg-surface text-primary border border-subtle'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => (
          <Card key={t.id} className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-primary">{t.name}</p>
              <p className="text-xs font-medium text-secondary capitalize">{t.category}</p>
            </div>
            {t.website && (
              <a href={t.website} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs font-semibold text-primary hover:underline">
                Visit
              </a>
            )}
          </Card>
        ))}
      </section>
    </div>
  );
}

export default Technologies;
