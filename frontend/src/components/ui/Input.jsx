function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-lg py-2 px-md font-body-sm text-body-sm outline-none transition-all ${className}`}
      style={{
        background: 'rgb(var(--color-surface-container-lowest))',
        boxShadow: '0 0 0 1px rgb(var(--color-outline-variant))',
        color: 'rgb(var(--color-on-surface))',
      }}
      onFocus={(e) => { e.target.style.boxShadow = '0 0 0 1px rgb(var(--color-primary))'; }}
      onBlur={(e) => { e.target.style.boxShadow = '0 0 0 1px rgb(var(--color-outline-variant))'; }}
      {...props}
    />
  );
}

export default Input;
