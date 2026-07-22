import { BookOpen, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { researchService } from '../../services/researchService.js';

const FILTER_CHIPS = ['All', 'Trending', 'Recently Published', 'Open Topics', 'Featured'];

const DOMAINS = ['All Domains', 'AI / Machine Learning', 'Data Science', 'Cybersecurity', 'Blockchain', 'Web Development', 'Mobile', 'DevOps', 'Cloud Computing', 'IoT', 'Other'];

const DIFFICULTIES = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

const FUNDING_OPTIONS = ['Any Funding', 'Funded', 'Unfunded', 'Grant Available'];

const DURATIONS = ['Any Duration', '1-4 Weeks', '1-3 Months', '3-6 Months', '6+ Months'];

const TYPES = ['All Types', 'Research Topic', 'Thesis', 'Capstone', 'Publication', 'Innovation Challenge', 'Industry Problem', 'Open Research'];

function ResearchHub() {
  const navigate = useNavigate();
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All Domains');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [selectedFunding, setSelectedFunding] = useState('Any Funding');
  const [selectedDuration, setSelectedDuration] = useState('Any Duration');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [showSideFilters, setShowSideFilters] = useState(false);

  useEffect(() => {
    fetchResearch();
  }, []);

  async function fetchResearch() {
    setLoading(true);
    setError(null);
    try {
      const data = await researchService.list();
      setResearchList(Array.isArray(data) ? data.filter(r => r && typeof r === 'object') : []);
    } catch (err) {
      setError(err?.message || 'Failed to load research');
    } finally {
      setLoading(false);
    }
  }

  const filtered = researchList.filter((r) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title?.toLowerCase().includes(q);
      const matchDesc = r.description?.toLowerCase().includes(q);
      const matchDomain = r.domain?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchDomain) return false;
    }
    if (selectedDomain !== 'All Domains' && r.domain !== selectedDomain) return false;
    if (selectedDifficulty !== 'All Levels' && r.difficulty !== selectedDifficulty) return false;
    if (selectedType !== 'All Types' && r.research_type !== selectedType) return false;
    if (selectedFunding !== 'Any Funding') {
      if (selectedFunding === 'Funded' && !r.funding) return false;
      if (selectedFunding === 'Unfunded' && r.funding) return false;
      if (selectedFunding === 'Grant Available' && r.funding !== 'grant') return false;
    }
    if (selectedInstitution && !r.institution?.toLowerCase().includes(selectedInstitution.toLowerCase())) return false;
    return true;
  });

  function resetFilters() {
    setSelectedDomain('All Domains');
    setSelectedDifficulty('All Levels');
    setSelectedFunding('Any Funding');
    setSelectedDuration('Any Duration');
    setSelectedType('All Types');
    setSelectedInstitution('');
    setSearchQuery('');
    setActiveChip('All');
  }

  const hasActiveFilters = selectedDomain !== 'All Domains' || selectedDifficulty !== 'All Levels' || selectedFunding !== 'Any Funding' || selectedDuration !== 'Any Duration' || selectedType !== 'All Types' || selectedInstitution || searchQuery;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Research & Innovation"
        title="Research Hub"
        actions={
          <Link to="/research/new">
            <Button variant="primary">
              <Plus size={18} />
              <span className="font-label-caps text-label-caps">Create Research</span>
            </Button>
          </Link>
        }
      />

      <div className="mt-8 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgb(var(--color-on-surface-variant) / 0.4)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search research..."
            className="w-full rounded-lg py-2 pl-10 pr-4 font-body-sm text-body-sm transition-all"
            style={{
              background: 'rgb(var(--color-surface-container-lowest))',
              border: 'none',
              outline: 'none',
              boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
              color: 'rgb(var(--color-on-surface))',
            }}
            onFocus={(e) => { e.target.style.boxShadow = '0 0 0 1px rgb(var(--color-primary))'; }}
            onBlur={(e) => { e.target.style.boxShadow = '0 0 0 1px rgb(var(--color-outline-variant))'; }}
          />
        </div>
        <button
          onClick={() => setShowSideFilters(!showSideFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-body-sm transition-all"
          style={{
            background: showSideFilters ? 'rgb(var(--color-surface-container-highest))' : 'rgb(var(--color-surface-container))',
            border: '1px solid rgb(var(--color-outline-variant))',
            color: showSideFilters ? 'rgb(var(--color-primary))' : 'rgb(var(--color-on-surface-variant))',
          }}
        >
          <SlidersHorizontal size={16} />
          <span className="font-label-caps text-label-caps">Filters</span>
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => setActiveChip(chip)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: activeChip === chip ? 'rgb(var(--color-primary))' : 'rgb(var(--color-surface-container-high))',
              color: activeChip === chip ? 'rgb(var(--color-on-primary))' : 'rgb(var(--color-on-surface-variant))',
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="mt-8 flex gap-8">
        {showSideFilters ? (
          <aside className="w-64 shrink-0 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Filters</span>
              {hasActiveFilters ? (
                <button onClick={resetFilters} className="text-xs font-semibold underline" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                  Clear all
                </button>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-[10px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Domain</label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full rounded-lg py-2 px-3 font-body-sm text-body-sm"
                style={{
                  background: 'rgb(var(--color-surface-container-lowest))',
                  border: 'none',
                  outline: 'none',
                  boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
              >
                {DOMAINS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-[10px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full rounded-lg py-2 px-3 font-body-sm text-body-sm"
                style={{
                  background: 'rgb(var(--color-surface-container-lowest))',
                  border: 'none',
                  outline: 'none',
                  boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
              >
                {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-[10px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Funding</label>
              <select
                value={selectedFunding}
                onChange={(e) => setSelectedFunding(e.target.value)}
                className="w-full rounded-lg py-2 px-3 font-body-sm text-body-sm"
                style={{
                  background: 'rgb(var(--color-surface-container-lowest))',
                  border: 'none',
                  outline: 'none',
                  boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
              >
                {FUNDING_OPTIONS.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-[10px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Duration</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full rounded-lg py-2 px-3 font-body-sm text-body-sm"
                style={{
                  background: 'rgb(var(--color-surface-container-lowest))',
                  border: 'none',
                  outline: 'none',
                  boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
              >
                {DURATIONS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-[10px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-lg py-2 px-3 font-body-sm text-body-sm"
                style={{
                  background: 'rgb(var(--color-surface-container-lowest))',
                  border: 'none',
                  outline: 'none',
                  boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
              >
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-[10px]" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>Institution</label>
              <input
                type="text"
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                placeholder="Filter by institution..."
                className="w-full rounded-lg py-2 px-3 font-body-sm text-body-sm"
                style={{
                  background: 'rgb(var(--color-surface-container-lowest))',
                  border: 'none',
                  outline: 'none',
                  boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
              />
            </div>
          </aside>
        ) : null}

        <div className="flex-1 min-w-0">
          {loading ? (
            <LoadingState label="Loading research..." />
          ) : error ? (
            <EmptyState
              icon={BookOpen}
              title="Failed to load research"
              description={error}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title={hasActiveFilters ? 'No matching research' : 'No Research Yet'}
              description={hasActiveFilters ? 'Try adjusting your filters or search query.' : 'Publish your first research project.'}
              actionLabel={hasActiveFilters ? undefined : 'Create Research'}
              onAction={hasActiveFilters ? undefined : () => navigate('/research/new')}
            />
          ) : (
            <div className="grid gap-lg sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((r) => (
                <Link key={r.id} to={`/research/${r.id}`} className="block">
                  <Card className="p-5 transition hover:-translate-y-0.5 hover:shadow-md h-full">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {r.research_type ? (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                            style={{
                              background: 'rgb(var(--color-surface-container-highest))',
                              color: 'rgb(var(--color-on-surface-variant))',
                            }}
                          >
                            {r.research_type}
                          </span>
                        ) : null}
                        <StatusBadge status={r.status || 'draft'} />
                      </div>
                    </div>

                    <h3 className="font-headline-md text-lg font-semibold leading-tight" style={{ color: 'rgb(var(--color-primary))' }}>
                      {r.title}
                    </h3>

                    <p className="mt-2 font-body-sm text-body-sm leading-5 line-clamp-2" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                      {r.description || 'No description'}
                    </p>

                    <div className="mt-4 flex items-center gap-2 flex-wrap">
                      {r.domain ? (
                        <span className="text-[11px] font-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                          {r.domain}
                        </span>
                      ) : null}
                      {r.difficulty ? (
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold"
                          style={{
                            background: 'rgb(var(--color-surface-container-high))',
                            color: r.difficulty === 'Advanced' ? 'rgb(var(--color-error))' : r.difficulty === 'Intermediate' ? 'rgb(var(--color-warning))' : 'rgb(var(--color-success))',
                          }}
                        >
                          {r.difficulty}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgb(var(--color-outline-variant) / 0.5)' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {r.supervisor ? (
                            <span className="font-body-sm text-body-sm font-medium" style={{ color: 'rgb(var(--color-on-surface))' }}>
                              {r.supervisor}
                            </span>
                          ) : r.institution ? (
                            <span className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                              {r.institution}
                            </span>
                          ) : null}
                        </div>
                        {r.open_positions > 0 ? (
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                            style={{
                              background: 'rgb(var(--color-primary) / 0.1)',
                              color: 'rgb(var(--color-primary))',
                            }}
                          >
                            {r.open_positions} open
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResearchHub;
