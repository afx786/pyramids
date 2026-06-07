import Button from '../ui/Button.jsx';

function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="rounded-lg border border-subtle bg-surface p-8 text-center">
      <h2 className="text-xl font-black text-primary">{title}</h2>
      {description ? <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-6 text-secondary">{description}</p> : null}
      {onRetry ? (
        <Button className="mt-6" variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      ) : null}
    </div>
  );
}

export default ErrorState;
