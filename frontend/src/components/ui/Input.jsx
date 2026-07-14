function Input({ className = '', ...props }) {
  return (
    <input
      className={`h-11 w-full rounded-lg border border-subtle bg-transparent px-3.5 text-sm font-medium text-primary outline-none transition placeholder:text-secondary focus:border-primary ${className}`}
      {...props}
    />
  );
}

export default Input;
