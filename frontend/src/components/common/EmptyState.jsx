import Button from '../ui/Button.jsx';

function EmptyState({ title, description, actionLabel, onAction, icon }) {
  const IconComponent = typeof icon === 'function' || (icon && typeof icon === 'object' && '$$typeof' in icon) ? icon : null;
  return (
    <div className="rounded-xl p-2xl text-center" style={{ border: '1px dashed rgb(var(--color-outline-variant))', background: 'rgb(var(--color-surface-container-low))' }}>
      {icon ? (
        <div className="mx-auto mb-lg flex h-14 w-14 animate-float items-center justify-center rounded-xl" style={{ background: 'rgb(var(--color-surface-container-high))', border: '1px solid rgb(var(--color-outline-variant))' }}>
          {IconComponent ? (
            <IconComponent className="h-6 w-6" strokeWidth={1.5} style={{ color: 'rgb(var(--color-on-surface-variant))' }} />
          ) : null}
        </div>
      ) : null}
      <h2 className="font-headline-md font-semibold" style={{ color: 'rgb(var(--color-on-surface))' }}>{title}</h2>
      {description ? <p className="mx-auto mt-md max-w-md font-body-sm text-body-sm leading-6" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>{description}</p> : null}
      {actionLabel ? (
        <Button className="mt-lg" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export default EmptyState;
