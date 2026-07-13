const variants = {
  primary: 'border border-primary bg-primary text-app shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
  secondary: 'border border-subtle bg-surface text-primary shadow-sm hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md active:translate-y-0',
  ghost: 'border border-transparent text-primary hover:bg-surface hover:border-subtle active:bg-accent-soft',
};

function Button({ children, className = '', variant = 'primary', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
