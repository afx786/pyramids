function EmptyState({ title, description, actionLabel, onAction, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-2xl px-lg text-center" style={{ minHeight: 280 }}>
      {Icon ? (
        <div className="mb-lg flex items-center justify-center w-14 h-14 rounded-2xl" style={{ background: 'rgb(var(--color-surface-container-high))', border: '1px solid rgb(var(--color-outline-variant))' }}>
          <Icon className="h-6 w-6" strokeWidth={1.5} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
        </div>
      ) : null}
      <h3 className="font-headline-md font-semibold mb-sm" style={{ color: 'rgb(var(--color-on-surface))' }}>{title}</h3>
      {description ? (
        <p className="font-body-sm max-w-sm mb-lg" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-lg py-sm rounded-lg font-body-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'rgb(var(--color-primary))', color: 'rgb(var(--color-on-primary))' }}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export default EmptyState;
