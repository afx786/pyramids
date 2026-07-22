import { Globe, Lock, GitBranch, FileText, Code2, Star, GitFork, Clock } from 'lucide-react';

const fields = [
  { key: 'name', icon: Code2, label: 'Repository' },
  { key: 'visibility', icon: Globe, label: 'Visibility' },
  { key: 'branch', icon: GitBranch, label: 'Branch' },
  { key: 'license', icon: FileText, label: 'License' },
  { key: 'language', icon: Code2, label: 'Language' },
  { key: 'stars', icon: Star, label: 'Stars' },
  { key: 'forks', icon: GitFork, label: 'Forks' },
  { key: 'updatedAt', icon: Clock, label: 'Updated' },
];

function RepositoryMetadata({ metadata = {}, className = '' }) {
  if (Object.keys(metadata).length === 0) {
    return <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No repository metadata available.</p>;
  }

  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-2.5 ${className}`}>
      {fields.map((field) => {
        const value = metadata[field.key];
        if (value == null || value === '') return null;
        const Icon = field.icon;
        return (
          <div key={field.key} className="flex items-center gap-2">
            <Icon size={12} strokeWidth={1.5} className="shrink-0" style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
            <div className="min-w-0">
              <span className="font-label-caps text-[9px] uppercase tracking-wider block" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{field.label}</span>
              <span className="font-mono text-[11px] block truncate" style={{ color: 'rgb(var(--color-on-surface))' }}>{String(value)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RepositoryMetadata;
