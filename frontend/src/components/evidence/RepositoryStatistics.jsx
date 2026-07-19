import { File, Blocks, Users, HardDrive, Code2 } from 'lucide-react';

const statFields = [
  { key: 'filesAnalyzed', icon: File, label: 'Files Analyzed', format: (v) => v?.toLocaleString() },
  { key: 'technologies', icon: Blocks, label: 'Technologies', format: (v) => v },
  { key: 'contributors', icon: Users, label: 'Contributors', format: (v) => v },
  { key: 'repositorySize', icon: HardDrive, label: 'Repo Size', format: (v) => v },
  { key: 'linesOfCode', icon: Code2, label: 'Lines of Code', format: (v) => v?.toLocaleString() },
];

function RepositoryStatistics({ statistics = {}, className = '' }) {
  if (Object.keys(statistics).length === 0) {
    return <p className="font-body-sm" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>No statistics available.</p>;
  }

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {statFields.map((field) => {
        const value = statistics[field.key];
        if (value == null) return null;
        const Icon = field.icon;
        return (
          <div key={field.key} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgb(var(--color-surface-container-low))' }}>
            <Icon size={14} strokeWidth={1.5} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
            <div>
              <span className="font-mono text-[12px] font-semibold block" style={{ color: 'rgb(var(--color-primary))' }}>{field.format(value)}</span>
              <span className="font-label-caps text-[8px] uppercase tracking-wider" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{field.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RepositoryStatistics;
