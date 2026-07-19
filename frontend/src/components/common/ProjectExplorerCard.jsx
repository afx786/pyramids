import { Link } from 'react-router-dom';

const ROLE_ABBREVIATIONS = {
  'Frontend': 'FE',
  'Backend': 'BE',
  'Full Stack': 'FS',
  'DevOps': 'OPS',
  'Security': 'SEC',
  'QA': 'QA',
  'ML': 'ML',
  'Data': 'DT',
  'Design': 'DS',
  'Product': 'PM',
  'Smart Contract': 'SC',
  'Research': 'RS',
};

function abbreviateRole(role) {
  return ROLE_ABBREVIATIONS[role] || role.slice(0, 2).toUpperCase();
}

function ProjectExplorerCard({ project, icon }) {
  const roles = project.open_roles ?? [];
  const technologies = project.technologies ?? project.stack ?? [];
  const score = project.repo_score ?? project.score;
  const verified = project.verified ?? false;
  const githubUrl = project.github_url ?? project.github;

  return (
    <Link to={`/projects/${project.id}`} className="block group">
      <article
        className="rounded-xl p-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer relative overflow-hidden"
        style={{
          background: 'rgb(var(--color-surface-container-low))',
          border: '1px solid rgb(var(--color-outline-variant))',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-primary))'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(var(--color-outline-variant))'; }}
      >
        <div className="flex justify-between items-start mb-md">
          <div className="flex items-center gap-sm min-w-0">
            <div
              className="w-10 h-10 rounded flex items-center justify-center shrink-0"
              style={{
                background: 'rgb(var(--color-surface))',
                border: '1px solid rgb(var(--color-outline-variant))',
              }}
            >
              {icon || (
                <svg className="w-5 h-5" style={{ color: 'rgb(var(--color-primary))' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <h3
                className="font-headline-md text-headline-md truncate flex items-center gap-xs"
                style={{ color: 'rgb(var(--color-primary))' }}
              >
                {project.title}
                {verified ? (
                  <span
                    className="shrink-0"
                    style={{ color: 'rgb(var(--color-primary))' }}
                    title="Verified"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                    </svg>
                  </span>
                ) : null}
              </h3>
              {githubUrl ? (
                <p
                  className="font-mono text-[12px] truncate"
                  style={{ color: 'rgb(var(--color-on-surface-variant))' }}
                >
                  {githubUrl.replace(/^https?:\/\//, '')}
                </p>
              ) : null}
            </div>
          </div>
          {score ? (
            <div className="text-right shrink-0 ml-md">
              <p
                className="font-label-caps text-label-caps leading-none"
                style={{ color: 'rgb(var(--color-primary))' }}
              >
                {score}
              </p>
              <p
                className="font-mono text-[10px]"
                style={{ color: 'rgb(var(--color-on-surface-variant))' }}
              >
                REPO SCORE
              </p>
            </div>
          ) : null}
        </div>
        {project.description ? (
          <p
            className="font-body-sm text-body-sm mb-lg line-clamp-2"
            style={{ color: 'rgb(var(--color-on-surface-variant))' }}
          >
            {project.description}
          </p>
        ) : null}
        {technologies.length > 0 ? (
          <div className="flex flex-wrap gap-xs mb-xl">
            {technologies.slice(0, 8).map((tech) => (
              <span
                key={tech}
                className="font-mono text-[11px] px-2 py-0.5 rounded"
                style={{
                  background: 'rgb(var(--color-surface-variant))',
                  color: 'rgb(var(--color-on-surface))',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        ) : (
          <div className="mb-xl" />
        )}
        <div
          className="pt-md"
          style={{ borderTop: '1px solid rgb(var(--color-outline-variant) / 0.3)' }}
        >
          {roles.length > 0 ? (
            <div className="flex justify-between items-center">
              <div className="flex -space-x-2">
                {roles.slice(0, 4).map((role, idx) => (
                  <span
                    key={idx}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold border text-[10px]"
                    style={{
                      background: 'rgb(var(--color-surface-container-highest))',
                      borderColor: 'rgb(var(--color-outline-variant))',
                      color: idx === 3 ? 'rgb(var(--color-primary))' : 'inherit',
                    }}
                    title={typeof role === 'string' ? role : role.name}
                  >
                    {typeof role === 'string' ? abbreviateRole(role) : abbreviateRole(role.name)}
                  </span>
                ))}
              </div>
              <span
                className="font-label-caps text-[11px]"
                style={{ color: 'rgb(var(--color-primary))' }}
              >
                {roles.length} {roles.length === 1 ? 'Open Role' : 'Open Roles'}
              </span>
            </div>
          ) : (
            <span
              className="font-label-caps text-[11px] italic"
              style={{ color: 'rgb(var(--color-on-surface-variant))' }}
            >
              No open roles currently
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}

export default ProjectExplorerCard;
