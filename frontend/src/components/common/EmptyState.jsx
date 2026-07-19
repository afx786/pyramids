import Button from '../ui/Button.jsx';

function EmptyState({ title, description, actionLabel, onAction, icon: Icon }) {
  return (
    <div className="rounded-xl p-10 text-center animate-scale-in" style={{ border: '1px dashed rgb(var(--color-border-subtle))', background: 'rgb(var(--color-glass))' }}>
      {Icon ? (
        <div className="mx-auto mb-6 flex h-14 w-14 animate-float items-center justify-center rounded-2xl" style={{ background: 'rgb(var(--color-accent) / 0.08)', border: '1px solid rgb(var(--color-accent) / 0.15)' }}>
          <Icon className="h-6 w-6" strokeWidth={1.5} style={{ color: 'rgb(var(--color-accent))' }} />
        </div>
      ) : null}
      <h2 className="text-xl font-black gradient-text">{title}</h2>
      {description ? <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-6 text-secondary">{description}</p> : null}
      {actionLabel ? (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export default EmptyState;
