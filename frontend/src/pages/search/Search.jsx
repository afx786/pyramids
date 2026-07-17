import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { connectionService } from '../../services/connectionService.js';
import { searchService } from '../../services/searchService.js';

const SEARCH_TABS = [
  { id: 'users', label: 'Users' },
  { id: 'projects', label: 'Projects' },
];

function Search() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('users');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setSearched(true);
    try {
      if (type === 'users') {
        const data = await searchService.searchUsersByName(query);
        setResults(Array.isArray(data) ? data : []);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    }
  }

  async function handleSendRequest(userId) {
    try {
      await connectionService.sendRequest(userId);
      setResults((prev) => prev.map((u) => (u.id === userId ? { ...u, _requestSent: true } : u)));
    } catch {}
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Discover"
        title="Search"
        description="Find builders, projects, and teams."
      />

      <section className="mt-10">
        <div className="flex gap-3">
          {SEARCH_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setType(t.id); setResults([]); setSearched(false); }}
              className={`rounded-lg px-5 py-3 text-sm font-black transition ${
                type === t.id ? 'bg-primary text-app' : 'bg-surface text-primary border border-subtle'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Input
            placeholder={type === 'users' ? 'Search by name...' : 'Search projects...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} className="shrink-0">Search</Button>
        </div>

        {searched && results.length === 0 && (
          <Card className="mt-6 p-8 text-center">
            <p className="text-sm text-secondary">No results found for "{query}".</p>
          </Card>
        )}

        {results.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((u) => (
              <Card key={u.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-primary">{u.name}</p>
                    {u.headline && <p className="mt-1 text-xs font-medium text-secondary">{u.headline}</p>}
                    <div className="mt-2 flex items-center gap-2">
                      <SkillTag>{u.rank || 'Builder'}</SkillTag>
                      <span className="text-xs text-secondary">{u.points} pts</span>
                    </div>
                    {u.branch && <p className="mt-1 text-xs text-secondary">{u.branch}</p>}
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <Link to={`/profile/${u.id}`}>
                      <Button variant="secondary" className="text-xs">View</Button>
                    </Link>
                    {u._requestSent ? (
                      <span className="text-xs font-semibold text-secondary">Sent</span>
                    ) : (
                      <Button variant="ghost" className="text-xs" onClick={() => handleSendRequest(u.id)}>
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Search;
