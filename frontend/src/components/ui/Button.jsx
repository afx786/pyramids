const variants = {
  primary:
    'font-bold py-sm px-xl rounded-lg active:scale-[0.98] transition-all duration-150 hover:opacity-90',
  secondary:
    'border font-medium py-sm px-xl rounded-lg active:scale-[0.98] transition-all duration-150 hover:opacity-80',
  ghost:
    'border border-transparent font-medium py-sm px-xl rounded-lg active:scale-[0.98] transition-all duration-150 hover:opacity-80',
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
          background: 'rgb(var(--color-primary))',
          color: 'rgb(var(--color-on-primary))',
        }
      : variant === 'secondary'
      ? {
          background: 'transparent',
          color: 'rgb(var(--color-on-surface))',
          borderColor: 'rgb(var(--color-outline-variant))',
        }
      : {
          background: 'transparent',
          color: 'rgb(var(--color-on-surface-variant))',
        };

  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center gap-2 text-body-sm font-semibold ${variants[variant]} ${className}`}
      style={baseStyle}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
