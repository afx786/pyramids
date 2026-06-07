function Input({ className = '', ...props }) {
  return (
    <input
      className={`h-11 w-full rounded-lg border border-subtle bg-surface px-4 text-sm text-primary outline-none transition placeholder:text-secondary focus:border-accent ${className}`}
      {...props}
    />
  );
}

export default Input;
