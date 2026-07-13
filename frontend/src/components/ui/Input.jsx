function Input({ className = '', ...props }) {
  return (
    <input
      className={`h-12 w-full rounded-none border border-subtle bg-transparent px-4 text-sm font-semibold text-primary outline-none transition placeholder:text-secondary focus:border-primary ${className}`}
      {...props}
    />
  );
}

export default Input;
