function Input({ className = '', ...props }) {
  return (
    <input
      className={`h-11 w-full rounded-xl px-3.5 text-sm font-medium outline-none transition-all duration-200 placeholder:text-secondary focus:ring-2 focus:ring-accent/30 ${className}`}
      style={{
        background: 'rgb(var(--color-glass))',
        border: '1px solid rgb(var(--color-glass-border))',
        color: 'rgb(var(--color-text-primary))',
      }}
      {...props}
    />
  );
}

export default Input;
