const variants = {
  primary: 'bg-primary text-app hover:opacity-90',
  secondary: 'bg-transparent text-primary border border-primary/20 hover:bg-surface',
  ghost: 'text-primary hover:bg-surface',
};

function Button({ children, className = '', variant = 'primary', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-5 text-sm font-bold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
