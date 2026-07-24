import { Search as SearchIcon, UserPlus, Check, Users, FolderGit2, Trophy, Star } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState.jsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatShortBatch } from '../../utils/batch.js';
import Button from '../../components/ui/Button.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import SkillTag from '../../components/ui/SkillTag.jsx';
import { connectionService } from '../../services/connectionService.js';
import { api } from '../../services/api.js';

const SEARCH_TABS = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'research', label: 'Research', icon: Star },
  { id: 'hackathons', label: 'Hackathons', icon: Trophy },

];

function Search() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('users');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch() {
    if (!query.trim()) return;
    setSearched(true);
    setError('');
    setSearching(true);
    try {
      if (type === 'users') {
        const data = await api.get(`/search/users/by-name?name=${encodeURIComponent(query)}`);
        setResults(Array.isArray(data) ? data : []);
      } else if (type === 'projects') {
        const data = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(data?.projects ?? []);
      } else if (type === 'research') {
        const data = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(data?.research ?? []);
      } else if (type === 'hackathons') {
        const data = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(data?.hackathons ?? []);
      }
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function handleSendRequest(userId) {
    setResults((prev) => prev.map((u) => (u.id === userId ? { ...u, _requestSent: true } : u)));
    connectionService.sendRequest(userId).catch(() => {
      setResults((prev) => prev.map((u) => (u.id === userId ? { ...u, _requestSent: false } : u)));
    });
  }

  function renderResult(item) {
    switch (type) {
      case 'users':
        return (
          <div key={item.id} className="p-lg rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-primary) / 0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
          >
            <div className="flex items-start justify-between gap-lg">
              <div className="min-w-0 flex-1">
                <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>
                  {item.name}
                  {(() => {
                    const batch = formatShortBatch(item.joining_year, item.graduating_year);
                    return batch ? <span className="font-mono text-[10px] ml-1.5" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>({batch})</span> : null;
                  })()}
                </p>
                {item.headline ? <p className="font-body-sm mt-xs" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{item.headline}</p> : null}
                <div className="flex items-center gap-sm mt-sm">
                  <SkillTag>{item.rank || 'Builder'}</SkillTag>
                  {item.points != null ? <span className="font-mono text-[11px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{item.points} pts</span> : null}
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-sm">
                <Link to={`/profile/${item.id}`}><Button variant="secondary" size="sm">View</Button></Link>
                {item._requestSent ? (
                  <span className="font-body-sm font-semibold flex items-center gap-1" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                    <Check size={14} /> Sent
                  </span>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => handleSendRequest(item.id)}>
                    <UserPlus size={14} /> Connect
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      case 'projects':
        return (
          <Link key={item.id} to={`/projects/${item.id}`} className="block">
            <div className="p-lg rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-primary) / 0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
            >
              <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{item.title}</p>
              <p className="font-body-sm mt-sm line-clamp-2" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{item.description}</p>
            </div>
          </Link>
        );
      case 'research':
        return (
          <Link key={item.id} to={`/research/${item.id}`} className="block">
            <div className="p-lg rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-primary) / 0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
            >
              <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{item.title}</p>
              {item.domain && <p className="font-mono text-[11px] mt-xs" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{item.domain}</p>}
              <p className="font-body-sm mt-sm line-clamp-2" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{item.description}</p>
            </div>
          </Link>
        );
      case 'hackathons':
        return (
          <Link key={item.id} to={`/hackathons/${item.id}`} className="block">
            <div className="p-lg rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-primary) / 0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
            >
              <p className="font-body-sm font-bold" style={{ color: 'rgb(var(--color-primary))' }}>{item.title}</p>
              <p className="font-body-sm mt-sm line-clamp-2" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{item.description}</p>
            </div>
          </Link>
        );
      default:
        return null;
    }
  }

  return (
    <div className="p-xl max-w-6xl mx-auto">
      <header className="mb-xl">
        <h2 className="font-display-serif text-display-serif" style={{ color: 'rgb(var(--color-primary))' }}>Search</h2>
        <p className="font-body-lg text-body-lg mt-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          Find builders, projects, research, and hackathons.
        </p>
      </header>

      <section>
        <div className="flex gap-md flex-wrap">
          {SEARCH_TABS.map((t) => {
            const Icon = t.icon;
            const isActive = type === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => { setType(t.id); setResults([]); setSearched(false); }}
                className="inline-flex items-center gap-2 px-lg py-sm rounded-lg font-bold transition-all"
                style={{
                  background: isActive ? 'rgb(var(--color-primary))' : 'rgb(var(--color-surface-container))',
                  color: isActive ? 'rgb(var(--color-on-primary))' : 'rgb(var(--color-on-surface))',
                  border: isActive ? 'none' : '1px solid rgb(var(--color-outline-variant))',
                }}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-lg flex items-center gap-md">
          <div className="relative flex-1 max-w-xl">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.4)' }} />
            <input
              placeholder={`Search ${type}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full rounded-lg py-2 pl-10 pr-4 font-body-sm transition-all"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
                color: 'rgb(var(--color-on-surface))',
                outline: 'none',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgb(var(--color-primary))'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
            />
          </div>
          <Button onClick={handleSearch}><SearchIcon size={16} /> Search</Button>
        </div>

        {error ? (
          <div className="mt-lg rounded-lg px-lg py-sm font-body-sm font-semibold"
            style={{ background: 'rgb(var(--color-error-container))', color: 'rgb(var(--color-on-error-container))' }}
          >
            {error}
          </div>
        ) : null}

        {searching ? (
          <div className="mt-lg grid gap-lg sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-lg rounded-xl space-y-md"
                style={{ background: 'rgb(var(--color-surface-container-low))', border: '1px solid rgb(var(--color-outline-variant))' }}
              >
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : searched && results.length === 0 && !error ? (
          <EmptyState
            icon={SearchIcon}
            title="No results found"
            description="Try searching for a different term."
          />
        ) : results.length > 0 ? (
          <div className="mt-lg grid gap-lg sm:grid-cols-2 xl:grid-cols-3">
            {results.map(renderResult)}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default Search;
