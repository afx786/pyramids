const variants = {
  primary: 'gradient-border shadow-lg hover:shadow-xl active:shadow-md btn-press',
  secondary:
    'border text-primary shadow-sm hover:shadow-lg active:shadow-md btn-press',
  ghost:
    'border border-transparent text-primary/80 hover:text-primary hover:bg-[rgb(var(--color-glass-border))] active:bg-[rgb(var(--color-glass))] btn-press',
};

function Button({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}) {
  const baseStyle =
    variant === 'primary'
      ? {
          background:
            'linear-gradient(135deg, rgb(var(--color-accent)), rgb(var(--color-accent) / 0.7))',
          color: 'rgb(var(--color-app))',
        }
      : variant === 'secondary'
      ? {
          background: 'rgb(var(--color-glass))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderColor: 'rgb(var(--color-glass-border))',
        }
      : {};

  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${variants[variant]} ${className}`}
      style={baseStyle}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
