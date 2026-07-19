import Button from '../ui/Button.jsx';

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-xl p-10 text-center animate-fade-in" style={{ border: '1px dashed rgb(var(--color-border-subtle))', background: 'rgb(var(--color-glass))' }}>
      <h2 className="text-xl font-black">{title}</h2>
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
