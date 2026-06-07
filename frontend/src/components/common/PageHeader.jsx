function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="flex items-start justify-between gap-8">
      <div>
        {eyebrow ? (
          <p className="text-xs font-black uppercase tracking-[0.24em] text-secondary">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 text-5xl font-black leading-none text-primary">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-secondary">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
    </header>
  );
}

export default PageHeader;
