import Button from '../ui/Button.jsx';

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-lg border border-dashed border-subtle bg-surface p-10 text-center">
      <h2 className="text-xl font-black text-primary">{title}</h2>
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
