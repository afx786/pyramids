import { ChevronLeft, ChevronRight, FolderGit2, Grid3X3, List, Plus, Search, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import ProjectExplorerCard from '../../components/common/ProjectExplorerCard.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import Button from '../../components/ui/Button.jsx';
import { projectService } from '../../services/projectService.js';

const DOMAINS = [
  'All', 'AI / Machine Learning', 'Frontend Engineering', 'Backend Systems',
  'Product Design', 'Cybersecurity', 'Open Source', 'Mobile',
  'Data Science', 'DevOps', 'Other',
];

const TECHNOLOGIES = [
  'All Technologies', 'Rust', 'TypeScript', 'Python', 'Go', 'Solidity',
  'C++', 'React', 'Node.js', 'Zero Knowledge',
];

function ProjectsExplorer() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [scoreMin, setScoreMin] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedTech, setSelectedTech] = useState('All Technologies');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 12;

  async function fetchProjects() {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.listProjects();
      const list = Array.isArray(data) ? data : [];
      setProjects(list);
      setTotalCount(list.length);
    } catch (err) {
      setError(err?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const filtered = projects.filter((p) => {
    if (verifiedOnly && !p.verified) return false;
    if (selectedTech !== 'All Technologies') {
      const techs = p.technologies ?? p.stack ?? [];
      if (!techs.some((t) => t.toLowerCase().includes(selectedTech.toLowerCase()))) return false;
    }
    if (selectedDomain !== 'All' && p.domain !== selectedDomain) return false;
    if (scoreMin > 0 && (p.repo_score ?? p.score ?? 0) < scoreMin) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchTech = (p.technologies ?? p.stack ?? []).some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTech) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  function resetFilters() {
    setScoreMin(0);
    setVerifiedOnly(false);
    setSelectedTech('All Technologies');
    setSelectedDomain('All');
    setSearchQuery('');
    setPage(1);
  }

  const hasFilters = scoreMin > 0 || verifiedOnly || selectedTech !== 'All Technologies' || selectedDomain !== 'All' || searchQuery;

  if (error) {
    return (
      <div className="p-xl max-w-container-max mx-auto">
        <ErrorState
          title="Failed to load projects"
          description={error}
          onRetry={fetchProjects}
        />
      </div>
    );
  }

  return (
    <div className="p-xl min-h-screen max-w-container-max mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-lg gap-lg">
        <div className="space-y-1">
          <h2 className="font-display-serif text-display-serif" style={{ color: 'rgb(var(--color-primary))' }}>
            Projects - Explorer
          </h2>
          <p className="font-body-lg text-body-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            Vetted repository work for high-impact contributors.
          </p>
        </div>
        <div className="flex items-center gap-xs shrink-0">
          <div
            className="flex items-center gap-xs p-1 rounded-lg"
            style={{
              background: 'rgb(var(--color-surface-container))',
              border: '1px solid rgb(var(--color-outline-variant))',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className="p-2 rounded transition-all"
              style={{
                background: viewMode === 'grid' ? 'rgb(var(--color-surface-container-highest))' : 'transparent',
                color: viewMode === 'grid' ? 'rgb(var(--color-primary))' : 'rgb(var(--color-on-surface-variant))',
              }}
              aria-label="Grid view"
            >
              <Grid3X3 size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="p-2 rounded transition-all"
              style={{
                background: viewMode === 'list' ? 'rgb(var(--color-surface-container-highest))' : 'transparent',
                color: viewMode === 'list' ? 'rgb(var(--color-primary))' : 'rgb(var(--color-on-surface-variant))',
              }}
              aria-label="List view"
            >
              <List size={20} />
            </button>
          </div>
          <Link to="/projects/new">
            <Button variant="primary">
              <Plus size={18} />
              <span className="font-label-caps text-label-caps">New Project</span>
            </Button>
          </Link>
        </div>
      </div>

      <section
        className="p-lg rounded-xl mb-2xl space-y-lg shadow-sm"
        style={{
          background: 'rgb(var(--color-surface-container-low))',
          border: '1px solid rgb(var(--color-outline-variant))',
        }}
      >
        <div className="flex items-center gap-md mb-lg">
          <SlidersHorizontal size={16} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
          <span className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
            Filters
          </span>
          {hasFilters ? (
            <button
              onClick={resetFilters}
              className="font-label-caps text-[11px] underline ml-auto"
              style={{ color: 'rgb(var(--color-on-surface-variant))' }}
            >
              Clear all
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-xl">
          <div className="space-y-sm">
            <label className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Search
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'rgb(var(--color-on-surface-variant) / 0.4)' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="Search projects..."
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
          </div>

          <div className="space-y-sm">
            <label className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Repository Score (Min {scoreMin})
            </label>
            <div className="flex items-center gap-md">
              <input
                type="range"
                min={0}
                max={1000}
                value={scoreMin}
                onChange={(e) => { setScoreMin(Number(e.target.value)); setPage(1); }}
                className="flex-1 h-1 rounded-lg appearance-none cursor-pointer"
                style={{
                  accentColor: 'rgb(var(--color-primary))',
                  background: 'rgb(var(--color-surface-variant))',
                }}
                aria-label="Minimum repository score"
              />
              <span className="font-mono text-body-sm" style={{ color: 'rgb(var(--color-primary))' }}>
                {scoreMin}
              </span>
            </div>
          </div>

          <div className="space-y-sm">
            <label className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Technologies
            </label>
            <select
              value={selectedTech}
              onChange={(e) => { setSelectedTech(e.target.value); setPage(1); }}
              className="w-full rounded-lg py-2 px-md font-body-sm text-body-sm appearance-none cursor-pointer"
              style={{
                background: 'rgb(var(--color-surface-container-lowest))',
                border: 'none',
                outline: 'none',
                boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
                color: 'rgb(var(--color-on-surface))',
              }}
              aria-label="Filter by technology"
            >
              {TECHNOLOGIES.map((tech) => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>

          <div className="space-y-sm">
            <label className="font-label-caps text-label-caps" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
              Domain
            </label>
            <div className="flex flex-wrap gap-xs">
              {DOMAINS.slice(0, 4).map((domain) => (
                <button
                  key={domain}
                  onClick={() => { setSelectedDomain(domain); setPage(1); }}
                  className="px-sm py-xs rounded text-[11px] font-label-caps transition-colors cursor-pointer"
                  style={{
                    background: selectedDomain === domain ? 'rgb(var(--color-surface-container-highest))' : 'rgb(var(--color-surface-container))',
                    color: selectedDomain === domain ? 'rgb(var(--color-primary))' : 'rgb(var(--color-on-surface-variant))',
                    border: selectedDomain === domain
                      ? '1px solid rgb(var(--color-primary) / 0.2)'
                      : '1px solid rgb(var(--color-outline-variant))',
                  }}
                >
                  {domain}
                </button>
              ))}
              {DOMAINS.length > 4 ? (
                <span
                  className="px-sm py-xs rounded text-[11px] font-label-caps cursor-pointer"
                  style={{
                    background: 'rgb(var(--color-surface-container))',
                    color: 'rgb(var(--color-on-surface-variant))',
                    border: '1px solid rgb(var(--color-outline-variant))',
                  }}
                  title={DOMAINS.slice(4).join(', ')}
                >
                  +{DOMAINS.length - 4}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-md pt-sm">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => { setVerifiedOnly(e.target.checked); setPage(1); }}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors"
              style={{
                background: verifiedOnly ? 'rgb(var(--color-primary))' : 'rgb(var(--color-surface-variant))',
              }}
            />
            <span className="ms-3 font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>
              Verified Only
            </span>
          </label>
        </div>
      </section>

      {loading ? (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-lg`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-lg"
              style={{
                background: 'rgb(var(--color-surface-container-low))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              <div className="flex justify-between items-start mb-md">
                <div className="flex items-center gap-sm">
                  <Skeleton className="w-10 h-10 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-4 w-12 ml-auto" />
                  <Skeleton className="h-3 w-16 ml-auto" />
                </div>
              </div>
              <Skeleton className="h-10 w-full mb-lg" />
              <div className="flex gap-xs mb-xl">
                <Skeleton className="h-5 w-14 rounded" />
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
              </div>
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title={hasFilters ? 'No matching projects' : 'No Projects Found'}
          description={hasFilters
            ? 'Try adjusting your filters or search query.'
            : 'Create your first project to showcase your work.'
          }
          actionLabel={hasFilters ? undefined : 'Create Project'}
          onAction={hasFilters ? undefined : () => { navigate('/projects/new'); }}
        />
      ) : (
        <>
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg'
                : 'grid grid-cols-1 gap-lg'
            }
          >
            {paginated.map((project) => (
              <ProjectExplorerCard
                key={project.id}
                project={project}
              />
            ))}
          </div>

          {totalPages > 1 ? (
            <div
              className="mt-2xl flex flex-col sm:flex-row justify-between items-center gap-lg pt-xl"
              style={{ borderTop: '1px solid rgb(var(--color-outline-variant))' }}
            >
              <p className="font-body-sm text-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
                Showing <span className="font-mono" style={{ color: 'rgb(var(--color-primary))' }}>
                  {Math.min(filtered.length, perPage)}
                </span> of{' '}
                <span className="font-mono" style={{ color: 'rgb(var(--color-primary))' }}>
                  {filtered.length}
                </span> vetted projects
              </p>
              <div className="flex items-center gap-md">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-xs px-md py-sm rounded transition-all disabled:opacity-30"
                  style={{
                    background: 'rgb(var(--color-surface-container))',
                    border: '1px solid rgb(var(--color-outline-variant))',
                    color: page <= 1 ? 'rgb(var(--color-on-surface-variant) / 0.4)' : 'rgb(var(--color-on-surface-variant))',
                  }}
                >
                  <ChevronLeft size={18} />
                  <span className="font-label-caps text-label-caps">Prev</span>
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center gap-xs px-md py-sm rounded transition-all disabled:opacity-30"
                  style={{
                    background: 'rgb(var(--color-surface-container))',
                    border: '1px solid rgb(var(--color-outline-variant))',
                    color: page >= totalPages ? 'rgb(var(--color-on-surface-variant) / 0.4)' : 'rgb(var(--color-on-surface-variant))',
                  }}
                >
                  <span className="font-label-caps text-label-caps">Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default ProjectsExplorer;
