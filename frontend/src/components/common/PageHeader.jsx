function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="flex items-start justify-between gap-2xl">
      <div>
        {eyebrow ? (
          <p className="font-label-caps text-label-caps uppercase tracking-widest" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{eyebrow}</p>
        ) : null}
        <h1 className="font-display-serif text-display-serif mt-xs" style={{ color: 'rgb(var(--color-on-surface))' }}>{title}</h1>
        {description ? (
          <p className="mt-md max-w-2xl font-body-lg text-body-lg leading-6" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-md">{actions}</div> : null}
    </header>
  );
}

export default PageHeader;
