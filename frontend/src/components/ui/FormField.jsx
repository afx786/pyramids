function FormField({ label, id, error, required, children, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="font-label-caps text-[10px] uppercase tracking-wider block" style={{ color: 'rgb(var(--color-on-surface-variant))' }}>
          {label}{required && <span className="ml-0.5" style={{ color: 'rgb(var(--color-error))' }}>*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="font-body-sm text-[11px]" style={{ color: 'rgb(var(--color-error))' }}>{error}</p>
      )}
    </div>
  );
}

export default FormField;
